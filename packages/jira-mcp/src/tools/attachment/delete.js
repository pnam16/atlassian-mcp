import {z} from "zod";
import {defineTool} from "../../define-tool.js";

export const registerDeleteAttachment = (server, jiraRequest) => {
  defineTool(
    server,
    "delete_attachment",
    {
      description:
        "Delete an attachment from Jira. This cannot be undone. Attachment IDs are shown by get_ticket in the Attachments line.",
      inputSchema: z.object({
        attachment_id: z.string().describe("Attachment ID, e.g. 10200"),
      }),
    },
    async ({attachment_id}, jira) => {
      await jira("DELETE", `/attachment/${attachment_id}`);
      return `Attachment ${attachment_id} deleted`;
    },
    jiraRequest,
  );
};
