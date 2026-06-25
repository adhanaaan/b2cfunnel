import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return {
      beforeFiles: [
        // Homepage = the short landing (flow 1); the quiz lives at /quiz.
        { source: "/", destination: "/landing/index.html" },
        // The long landing (full assessment page) available at /full.
        { source: "/full", destination: "/landing/full.html" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
