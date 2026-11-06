import {registerDeleteAttachment} from "../../src/tools/attachment/delete.js";
import {testRequests} from "../helpers/fake-server.js";

testRequests([
  [
    registerDeleteAttachment,
    "delete_attachment",
    {attachment_id: "10200"},
    ["DELETE", "/attachment/10200"],
  ],
]);
