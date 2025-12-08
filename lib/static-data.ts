import { readFile } from "fs/promises";
import { resolve, join } from "path";
import { parse } from "smol-toml";

/**
 * Mirror configuration interface
 */
export interface Mirror {
  name: string;
  path: string;
  description?: string;
  is_external?: boolean;
  lastModified?: string; // Optional, might not be relevant if purely config-based or can be fetched
}

/**
 * Other Mirror interface (for footer links)
 */
export interface OtherMirror {
  name: string;
  url: string;
  description?: string;
}

/**
 * Site configuration interface
 */
interface SiteConfig {
  site: {
    title: string;
    subtitle: string;
    readme?: string;
    
    // UI Configuration
    mirror_list_title?: string;
    mirror_list_subtitle?: string;
    documentation_title?: string;
    documentation_subtitle?: string;
    other_mirrors_title?: string;
    other_mirrors_subtitle?: string;

    other_mirrors?: OtherMirror[];
  };
  mirrors: Mirror[];
}

/**
 * Readme interface
 */
export interface ReadmeData {
  content: string;
  lastModified: string;
}

/**
 * Load and parse the mirrors.toml configuration file
 */
async function loadConfig(): Promise<SiteConfig> {
  try {
    const configPath = resolve(process.cwd(), "mirrors.toml");
    const configContent = await readFile(configPath, "utf-8");
    return parse(configContent) as unknown as SiteConfig;
  } catch (error) {
    console.error("Error loading mirrors.toml:", error);
    // Return default empty config or throw
    return {
      site: {
        title: "Mirror Repository",
        subtitle: "Configuration not loaded",
      },
      mirrors: [],
    };
  }
}

/**
 * Get a list of available mirrors from configuration
 */
export async function getMirrors(): Promise<Mirror[]> {
  const config = await loadConfig();
  return config.mirrors || [];
}

/**
 * Get the content of the configured README file
 */
export async function getReadme(): Promise<ReadmeData> {
  const config = await loadConfig();
  const readmePathStr = config.site?.readme || "init.md";
  
  // Try to resolve readme path: 
  // 1. As absolute path (if starts with /)
  // 2. Relative to project root
  let readmePath: string;
  if (readmePathStr.startsWith("/")) {
      readmePath = readmePathStr;
  } else {
      readmePath = resolve(process.cwd(), readmePathStr);
  }

  try {
    // Get file stats for Last-Modified header
    // We can use fs.stat to get the modification time of the file
    const { stat } = await import("fs/promises"); 
    const stats = await stat(readmePath);
    const lastModified = stats.mtime.toISOString();

    // Read README content
    const content = await readFile(readmePath, "utf-8");

    return {
      content,
      lastModified,
    };
  } catch (error) {
    // If README doesn't exist, return a default message
    console.warn(`README not found at ${readmePath}:`, error);
    
    return {
      content: `# Welcome\n\nNo README file found at configured path: \`${readmePathStr}\`.`,
      lastModified: new Date().toISOString(),
    };
  }
}

/**
 * Get site metadata from config
 */
export async function getSiteConfig() {
    const config = await loadConfig();
    return config.site;
}
