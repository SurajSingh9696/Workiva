import {
  generateReactHelpers,
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

// to create our own custom image for uploading we need useUploadThing
export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();
// Connects your custom UI component to an UploadThing upload endpoint

// This does three important things:
// Connects to the avatarImage upload endpoint
// Gives you startUpload(files) to trigger uploads manually
// Gives upload state (isUploading) for UI control
