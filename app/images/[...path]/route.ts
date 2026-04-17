import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const filePath = path.join("/");

  // Security: prevent directory traversal
  if (filePath.includes("..")) {
    return new NextResponse("Not found", { status: 404 });
  }

  const ext = "." + filePath.split(".").pop()?.toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  try {
    const fullPath = join(process.cwd(), "public", "images", filePath);
    const data = await readFile(fullPath);
    return new NextResponse(data, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
