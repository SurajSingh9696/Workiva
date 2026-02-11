import { createRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "./core";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,

  // Apply an (optional) custom config:
  // config: { ... },
});

// createRouteHandler reads your ourFileRouter and automatically:
// Handles POST uploads
// Handles GET requests (status, maybe configs)

// So the path /api/uploadthing becomes the backend endpoint your React UploadButton will talk to.
