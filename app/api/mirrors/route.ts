import { NextResponse } from "next/server";
import { readdir, stat } from "fs/promises";
import { join, resolve } from "path";
import { config } from "@/lib/config";

export const dynamic = "force-dynamic";

/**
 * Mirror interface representing a single mirror directory
 */
interface Mirror {
  name: string;
  path: string;
  lastModified: string;
}

/**
 * GET /api/mirrors
 * Returns a list of available mirror directories
 */
export async function GET() {
  try {
    const mirrorsPath = resolve(config.mirrorsPath);

    // Read directory contents
    const entries = await readdir(mirrorsPath, { withFileTypes: true });

    // Filter only directories and exclude hidden directories
    const mirrors: Mirror[] = [];

    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith(".")) {
        try {
          const fullPath = join(mirrorsPath, entry.name);
          const stats = await stat(fullPath);

          mirrors.push({
            name: entry.name,
            path: `/${entry.name}`,
            lastModified: stats.mtime.toISOString(),
          });
        } catch (error) {
          // Skip directories we can't read
          console.error(`Error reading directory ${entry.name}:`, error);
          continue;
        }
      }
    }

    // Sort by name alphabetically
    mirrors.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({
      success: true,
      mirrors,
      count: mirrors.length,
    });
  } catch (error) {
    console.error("Error reading mirrors directory:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to read mirrors directory",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

