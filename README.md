# atlassian-mcp

MCP servers for self-hosted Atlassian products (Jira and Confluence Server/Data Center). They let an AI assistant such as Claude Code read and write your Jira and Confluence directly.

## Packages

| Package                                                    | npm                  | What it serves                           |
| ---------------------------------------------------------- | -------------------- | ---------------------------------------- |
| [packages/jira-mcp](packages/jira-mcp)                     | `g-jira-mcp`         | Jira Server/Data Center (REST API v2)    |
| [packages/confluence-mcp](packages/confluence-mcp)         | `conf-mcp`           | Confluence Server/Data Center (REST API) |
| [packages/atlassian-self-mcp](packages/atlassian-self-mcp) | `atlassian-self-mcp` | Both of the above, from one server       |

Each package README has the install command, environment variables and tool list. Use `atlassian-self-mcp` when you work with both Jira and Confluence, so your assistant needs one server entry instead of two.

## Development

Requires Node.js 18+ and pnpm.

```bash
pnpm install
pnpm test              # every package
pnpm -w run check      # biome check and tsc, read only
pnpm lint              # same checks, but rewrites files to fix formatting
pnpm build             # every package, each to its own dist/index.js
```

Releases run per package; see [docs/RELEASE.md](docs/RELEASE.md).
