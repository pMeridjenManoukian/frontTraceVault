import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone', // ✅ Pour Vercel
  reactStrictMode: true,
};

export default nextConfig;
