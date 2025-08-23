import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/timescar",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "share.timescar.jp",
        port: "",
        pathname: "/station_photo/**",
      },
    ],
  },
};

export default nextConfig;
