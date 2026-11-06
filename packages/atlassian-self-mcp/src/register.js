import {registerTools as registerConfluence} from "conf-mcp/src/register.js";
import {registerTools as registerJira} from "g-jira-mcp/src/register.js";

// Both packages register these names, and one server cannot hold two tools of
// one name, so here they carry their product as a prefix.
const SHARED = new Set(["add_comment", "download_attachment"]);

const prefixShared = (server, prefix) => ({
  registerTool: (name, config, handler) =>
    server.registerTool(
      SHARED.has(name) ? `${prefix}_${name}` : name,
      config,
      handler,
    ),
});

/** @param {any} server */
export const registerTools = (server) => {
  registerJira(prefixShared(server, "jira"));
  registerConfluence(prefixShared(server, "confluence"));
};
