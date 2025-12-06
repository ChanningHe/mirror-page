import { NextRequest, NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import { join, resolve } from "path";
import { config } from "@/lib/config";

export const dynamic = "force-dynamic";

/**
 * GET /api/readme
 * Returns the content of README.md file from the mirrors directory
 */
export async function GET(request: NextRequest) {
  try {
    const mirrorsPath = resolve(config.mirrorsPath);
    const readmePath = join(mirrorsPath, "README.md");

    // Get file stats for Last-Modified header
    const stats = await stat(readmePath);
    const lastModified = stats.mtime.toUTCString();

    // Check if client has the latest version (ETag/If-Modified-Since)
    const ifModifiedSince = request.headers.get("if-modified-since");
    if (ifModifiedSince) {
      const clientDate = new Date(ifModifiedSince);
      const fileDate = new Date(lastModified);

      if (fileDate <= clientDate) {
        return new NextResponse(null, { status: 304 });
      }
    }

    // Read README content
    const content = await readFile(readmePath, "utf-8");

    return NextResponse.json(
      {
        success: true,
        content,
        lastModified,
      },
      {
        headers: {
          "Last-Modified": lastModified,
          "Cache-Control": "no-cache",
        },
      }
    );
  } catch (error) {
    // If README.md doesn't exist, return a default message
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return NextResponse.json(
        {
          success: true,
          content: "# Welcome\n\nNo README.md file found in the mirrors directory.",
          lastModified: new Date().toUTCString(),
        },
        {
          headers: {
            "Cache-Control": "no-cache",
          },
        }
      );
    }

    console.error("Error reading README.md:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to read README.md",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

