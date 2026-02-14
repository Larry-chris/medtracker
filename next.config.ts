import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ❌ SURTOUT PAS de : output: 'export'
  images: { unoptimized: true },
};

export default nextConfig;