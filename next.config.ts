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
        // Prologue landing page; its quiz lives at /prologue/quiz.
        { source: "/prologue", destination: "/landing/woman.html" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  async redirects() {
    return [
      { source: "/woman", destination: "/prologue", permanent: true },
      { source: "/woman/quiz", destination: "/prologue/quiz", permanent: true },
      // The #MambaCares funnel is /mambacares; the singular gets typed and
      // written down just as often, so both spellings land. Temporary (307)
      // rather than permanent: nothing is cached in a browser that would have
      // to be undone if /mambacare is ever wanted as a route of its own.
      { source: "/mambacare", destination: "/mambacares", permanent: false },
      {
        source: "/mambacare/leaderboard",
        destination: "/mambacares/leaderboard",
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        // Booth wifi: the game's sounds should be fetched once per device.
        source: "/sounds/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=3600" }],
      },
    ];
  },
};

export default nextConfig;
