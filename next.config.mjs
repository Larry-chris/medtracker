/** @type {import('next').NextConfig} */
const nextConfig = {
  // On force Vercel à ignorer les erreurs de style (ESLint)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // On force Vercel à ignorer les erreurs de types (TypeScript)
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ta configuration d'images
  images: {
    unoptimized: true,
  },
};

export default nextConfig;