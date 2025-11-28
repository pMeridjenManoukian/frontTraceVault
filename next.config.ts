import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone', // ✅ Pour Vercel
  reactStrictMode: true,

  // Exclude pino and thread-stream from being bundled
  serverExternalPackages: ['pino', 'pino-pretty', 'thread-stream'],

  // Turbopack config
  turbopack: {
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
  },
};

export default nextConfig;
