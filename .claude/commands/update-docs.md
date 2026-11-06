---
description: Sync README.md and docs/*.md with source for one package or both (runs on Haiku via the update-docs agent)
argument-hint: "[jira-mcp|confluence-mcp]"
allowed-tools: Agent
---

Launch the `update-docs` agent (subagent_type: update-docs) for package: $ARGUMENTS. Empty means both packages. Relay its report.
