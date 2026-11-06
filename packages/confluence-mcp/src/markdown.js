import MarkdownIt from "markdown-it";
import {z} from "zod";

// xhtmlOut: emit self-closing void tags (<br/>, <img/>) required by Confluence
// storage format's strict XHTML parser. html: false so raw/malformed tags are
// escaped to safe text instead of breaking the strict parser on a full-replace
// PUT; use body_format='storage' to send raw XHTML/macros. linkify: auto-link
// bare URLs (no over-matching of scheme-like tokens or paths).
const md = new MarkdownIt({html: false, linkify: true, xhtmlOut: true});

/** Convert Markdown to Confluence storage format (XHTML). */
export const toStorage = (markdown) => md.render(markdown);

export const writeBodyParamsSchema = {
  body_format: z
    .enum(["storage", "markdown"])
    .optional()
    .describe(
      "Format of the provided body: 'storage' (default, raw Confluence storage XHTML) or 'markdown' (Markdown, converted to storage server-side). Use 'storage' for Confluence macros (code, panel, expand, TOC) which Markdown cannot express.",
    ),
};

/** Resolve a body value to storage format based on body_format. */
export const resolveBody = (body, bodyFormat) =>
  bodyFormat === "markdown" && body != null ? toStorage(body) : body;
