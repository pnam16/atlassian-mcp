# Hướng dẫn Release

Monorepo có 3 package, mỗi package release riêng từ thư mục của nó:

| Thư mục                       | Tên npm              | Tag                          | Mirror                  |
| ----------------------------- | -------------------- | ---------------------------- | ----------------------- |
| `packages/jira-mcp`           | `g-jira-mcp`         | `jira-v${version}`           | `pnam16/jira-mcp`       |
| `packages/confluence-mcp`     | `conf-mcp`           | `conf-v${version}`           | `pnam16/confluence-mcp` |
| `packages/atlassian-self-mcp` | `atlassian-self-mcp` | `atlassian-self-v${version}` | không có                |

Tên `jira-mcp` trên npm đã bị tài khoản khác chiếm, nên package Jira publish với tên `g-jira-mcp`.

## Yêu cầu

- Node.js 18+
- pnpm
- Đã cài dependencies: `pnpm install` ở thư mục gốc
- Quyền push lên `pnam16/atlassian-mcp` và hai repo mirror qua SSH alias `github-pnam16` (xem `scripts/mirror.js`)

## Quy trình release

1. Commit mọi thay đổi trước: `.release-it.json` đặt `requireCleanWorkingDir: true`, nên release-it dừng lại nếu working tree chưa sạch.

2. Chạy release trong thư mục package:

   ```bash
   cd packages/jira-mcp
   pnpm release
   ```

   release-it sẽ:
   - Chạy `pnpm -w run check` (biome check và tsc, chỉ kiểm tra, không sửa file), `pnpm test` và `pnpm build`
   - Hỏi phiên bản mới (patch/minor/major) và bump version trong `package.json`
   - Commit với message `chore(<package>): release v${version}`, tạo tag theo bảng trên, push commit và tag lên `pnam16/atlassian-mcp`
   - Mở trang tạo GitHub release (cần điền thủ công trong browser)

   Nếu bước check báo lỗi format, chạy `pnpm lint` ở thư mục gốc để sửa, commit, rồi chạy lại `pnpm release`.

3. Với `jira-mcp` và `confluence-mcp`, release-it chạy tiếp `scripts/mirror.js` (hook `after:release`):
   - Lấy nội dung `packages/<pkg>` tại HEAD, tạo một commit nối lên `main` của repo mirror
   - Push commit đó lên `main` và tag `v${version}` của mirror, cả hai cùng lúc (`--atomic`): nếu một bên bị từ chối thì không bên nào thay đổi

   Không sửa code trực tiếp trong repo mirror: lần release sau sẽ ghi đè nội dung đó.

4. Publish lên npm. `.release-it.json` đặt `npm.publish: false`, nên `pnpm release` không tự publish. Bước 2 đã build lại `dist/index.js`, sau đó chạy trong thư mục package:

   ```bash
   pnpm publish
   ```

   Field `files` trong `package.json` chỉ đóng gói `dist/`.

5. Release lại `atlassian-self-mcp`. Package này đóng gói sẵn code của `jira-mcp` và `confluence-mcp` vào `dist/index.js`, nên bản mới của hai package kia chỉ đến tay người dùng `atlassian-self-mcp` sau khi nó được release và publish lại (bước 2 và 4 trong `packages/atlassian-self-mcp`). Package này phải publish bằng `pnpm publish`: nó khai báo `workspace:*`, pnpm đổi thành số version khi publish, còn `npm publish` thì giữ nguyên.

## Kiểm tra nhanh sau build

```bash
node dist/index.js
```

Server phải khởi động và log ra stderr (stdout chỉ dành cho giao thức MCP), không có lỗi.

## Checklist trước `pnpm release`

- [ ] `.env` không bị commit (đã có trong `.gitignore`)
- [ ] README/docs của package phản ánh đúng tools và params hiện tại
- [ ] Local branch đã cập nhật, mọi thay đổi đã commit
