import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve AVIF where the browser supports it, WebP otherwise
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
