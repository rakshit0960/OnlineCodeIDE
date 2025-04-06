import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), 'ssh2'];
    }
    return config;
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
};


export default nextConfig;
