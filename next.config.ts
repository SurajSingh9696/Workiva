import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [{ hostname: "we2plp04mq.ufs.sh", protocol: "https" }],
  },
};

export default nextConfig;
