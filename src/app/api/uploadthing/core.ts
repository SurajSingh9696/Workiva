import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
// ourFileRouter is an object containing all your upload endpoints.
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  //imageUploader is the custom upload endpoint - special API , where users can send files
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      //   const user = await auth(req);
      const user = await getCurrentUser();

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    }) //once upload is done, run this server-side function
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.ufsUrl);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

// This gives you a TypeScript type that describes all endpoints.
// You’ll use this type in React to make sure endpoint="imageUploader" is valid and type-safe.
export type OurFileRouter = typeof ourFileRouter;
