/**
 * Application configuration loaded from environment variables
 */
export const config = {
  // Site information
  siteTitle: process.env.NEXT_PUBLIC_SITE_TITLE || "Package Mirror Repository",
  siteSubtitle: process.env.NEXT_PUBLIC_SITE_SUBTITLE || "High-speed software package mirrors",
  
  // Mirror data path (absolute path on the server)
  mirrorsPath: process.env.MIRRORS_PATH || "/data/mirrors",
  
  // README update interval in milliseconds (default: 30 seconds)
  readmeUpdateInterval: parseInt(
    process.env.NEXT_PUBLIC_README_UPDATE_INTERVAL || "30000",
    10
  ),
} as const;

/**
 * Validates the configuration
 * Throws an error if critical configuration is missing
 */
export function validateConfig(): void {
  if (!config.mirrorsPath) {
    throw new Error("MIRRORS_PATH environment variable is required");
  }
}

