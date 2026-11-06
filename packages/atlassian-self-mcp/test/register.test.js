import assert from "node:assert/strict";
import {test} from "node:test";
import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {registerTools} from "../src/register.js";

// The real McpServer throws on a duplicate tool name, which would stop the
// combined server at startup.
test("registers every Jira and Confluence tool on one server", () => {
  const server = new McpServer({name: "t", version: "0"});
  const names = [];
  const {registerTool} = server;
  server.registerTool = (name, ...rest) => {
    names.push(name);
    return registerTool.call(server, name, ...rest);
  };
  registerTools(server);
  assert.equal(names.length, 36);
  for (const name of [
    "jira_add_comment",
    "confluence_add_comment",
    "jira_download_attachment",
    "confluence_download_attachment",
    "get_ticket",
    "get_page",
  ]) {
    assert.ok(names.includes(name), name);
  }
});
