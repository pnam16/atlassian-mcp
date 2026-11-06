# atlassian-mcp

## Commands

- Full test run: `pnpm test` at the root.
- One test file: from `packages/<pkg>/`, run `node --test test/<path>.test.js`.
- Gate: `pnpm -w run check` (biome check and tsc, read only; release runs it too). `pnpm lint` is NOT a gate: it runs `biome migrate --write` and `biome check --write`, so it rewrites files instead of failing.

## Do not touch

- The mirror repos pnam16/jira-mcp and pnam16/confluence-mcp. Edit only here: on release, `scripts/mirror.js` commits `packages/<pkg>` on top of the mirror's main, so a direct edit there is replaced by the next release.

## Gotchas

- npm names differ from folder names: `packages/jira-mcp` publishes as `g-jira-mcp`, `packages/confluence-mcp` as `conf-mcp`, `packages/atlassian-self-mcp` as `atlassian-self-mcp`. Install commands in docs use the npm name.
- `atlassian-self-mcp` bundles the other two packages through `src/register.js` in each. A jira or confluence release reaches its users only after `atlassian-self-mcp` is released too. Publish it with `pnpm publish`: its `workspace:*` versions stay literal under `npm publish`.
- The same tool name in both packages (today `add_comment`, `download_attachment`) must get a prefix in `packages/atlassian-self-mcp/src/register.js`; otherwise its server throws "already registered" at startup, which its test catches.
- `pnpm release` (run inside the package) tags `jira-v<version>` or `conf-v<version>` and runs the mirror, but `.release-it.json` sets `npm.publish: false`. `npm publish` is a separate manual step afterwards; skipping it leaves npm users on the old version.
- The packages fake Atlassian differently. Jira tools receive `jiraRequest` as an argument (`registerX(server, jiraRequest)`), and tests pass a fake from `test/helpers/fake-server.js`. Confluence tools import `confluenceRequest` directly, and tests stub `globalThis.fetch`. Follow the package's own style rather than adding a seam.
- `fakeServer` calls the handler directly and skips the zod `inputSchema`. A guard that a test must cover belongs in the handler; a test relying on schema validation passes for the wrong reason.
- Confluence write tools never replace existing data on their own (for example, `upload_attachment` always posts a new attachment and never updates a same-name one). Any overwrite must be an explicit opt-in parameter, agreed with the user first.
