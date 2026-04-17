import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const filePath = path.join("/");
  if (filePath.includes("..")) return new NextResponse("Not found", { status: 404 });

  try {
    const fullPath = join(process.cwd(), "public", "fonts", filePath);
    const data = await readFile(fullPath);
    return new NextResponse(data, {
      headers: {
        "Content-Type": "font/ttf",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
