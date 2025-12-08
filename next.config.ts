import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export
  output: "export",
  
  // Required for static export as there's no Node.js server for image optimization
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
