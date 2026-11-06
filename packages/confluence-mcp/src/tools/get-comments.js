import {z} from "zod";
import {confluenceRequest} from "../confluence-client.js";
import {defineTool} from "../define-tool.js";

export const getComments = async ({page_id}) => {
  const params = new URLSearchParams({expand: "body.view", limit: "50"});
  return confluenceRequest(
    "GET",
    `/content/${page_id}/child/comment?${params}`,
  );
};

export const registerGetComments = (server) => {
  defineTool(
    server,
    "get_comments",
    {
      description: "Get comments on a Confluence page",
      inputSchema: z.object({
        page_id: z
          .string()
          .describe("Confluence page/content ID to fetch comments for"),
      }),
    },
    getComments,
  );
};
