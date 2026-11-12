import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Serve the flipbook portfolio (public/book.html) as the home page.
  async rewrites() {
    return {
      beforeFiles: [{ source: "/", destination: "/book.html" }],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
