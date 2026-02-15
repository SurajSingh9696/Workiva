import { NextRequest, NextResponse } from "next/server";
import Busboy from "busboy";
import { Readable } from "stream";

const MAX_FILE_SIZE = 1024 * 1024; // 1MB in bytes

interface FileData {
  filename: string;
  mimeType: string;
  base64: string;
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type");
    
    if (!contentType || !contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Content-Type must be multipart/form-data" },
        { status: 400 }
      );
    }

    // Convert Request to Node.js readable stream
    const buffer = await request.arrayBuffer();
    const nodeStream = Readable.from(Buffer.from(buffer));

    return new Promise<NextResponse>((resolve) => {
      const busboy = Busboy({
        headers: {
          "content-type": contentType,
        },
        limits: {
          fileSize: MAX_FILE_SIZE,
          files: 1,
        },
      });

      let fileData: FileData | null = null;
      let fileSize = 0;
      let fileTooLarge = false;

      busboy.on("file", (fieldname, file, info) => {
        const { filename, mimeType } = info;

        // Validate file type
        if (!mimeType.startsWith("image/") && mimeType !== "application/pdf") {
          file.resume();
          resolve(
            NextResponse.json(
              { error: "Only images and PDF files are allowed" },
              { status: 400 }
            )
          );
          return;
        }

        const chunks: Buffer[] = [];

        file.on("data", (chunk: Buffer) => {
          fileSize += chunk.length;
          if (fileSize > MAX_FILE_SIZE) {
            fileTooLarge = true;
            file.resume(); // Skip the rest of the file
          } else {
            chunks.push(chunk);
          }
        });

        file.on("end", () => {
          if (!fileTooLarge && chunks.length > 0) {
            const buffer = Buffer.concat(chunks);
            const base64 = `data:${mimeType};base64,${buffer.toString("base64")}`;
            
            fileData = {
              filename,
              mimeType,
              base64,
            };
          }
        });
      });

      busboy.on("finish", () => {
        if (fileTooLarge) {
          resolve(
            NextResponse.json(
              { error: "File size exceeds 1MB limit" },
              { status: 413 }
            )
          );
          return;
        }

        if (!fileData) {
          resolve(
            NextResponse.json(
              { error: "No file uploaded" },
              { status: 400 }
            )
          );
          return;
        }

        resolve(
          NextResponse.json({
            success: true,
            data: fileData,
          })
        );
      });

      busboy.on("error", (error: Error) => {
        console.error("Busboy error:", error);
        resolve(
          NextResponse.json(
            { error: "File upload failed" },
            { status: 500 }
          )
        );
      });

      // Pipe the stream to busboy
      nodeStream.pipe(busboy);
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "File upload failed" },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
