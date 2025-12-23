import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      canvas: path.resolve(process.cwd(), "empty-canvas.js"),
    };
    return config;
  },
};

export default nextConfig;
