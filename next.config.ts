import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com",
        pathname: "/platform/profilepic/**",
      },
    ],
  },
};

export default nextConfig;
