import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return {
      beforeFiles: [
        // Homepage = the short landing (flow 1); the quiz lives at /quiz.
        { source: "/", destination: "/landing/index.html" },
        // The long landing (flow 2) kept available.
        { source: "/flow2", destination: "/landing/flow2.html" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
