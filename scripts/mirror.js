// Publishes packages/<pkg> at HEAD to its mirror repo as one commit on top of
// the mirror's main, tagged v<version>. The mirrors exist only to keep their
// GitHub stars; all development happens in this monorepo.
// commit-tree instead of `git subtree split`: split loses history across the
// conf-mcp -> confluence-mcp folder rename.
import {execFileSync} from "node:child_process";

const MIRRORS = new Set(["confluence-mcp", "jira-mcp"]);
const [pkg, version] = process.argv.slice(2);
if (!MIRRORS.has(pkg) || !version) {
  console.error(
    "usage: node scripts/mirror.js <jira-mcp|confluence-mcp> <version>",
  );
  process.exit(1);
}

// shortcut: SSH host alias from the maintainer's ~/.ssh/config, change it when releasing from another machine
const url = `git@github-pnam16:pnam16/${pkg}.git`;
const git = (...args) => execFileSync("git", args, {encoding: "utf8"}).trim();

git("fetch", url, "main");
const parent = git("rev-parse", "FETCH_HEAD");
const tree = git("rev-parse", `HEAD:packages/${pkg}`);
const commit = git(
  "commit-tree",
  tree,
  "-p",
  parent,
  "-m",
  `chore: release v${version}`,
);
git(
  "push",
  // atomic: a rejected tag (re-run after a half-failed release) must not leave main moved.
  "--atomic",
  url,
  `${commit}:refs/heads/main`,
  `${commit}:refs/tags/v${version}`,
);
console.log(`Mirrored packages/${pkg} to ${url} as v${version}`);
