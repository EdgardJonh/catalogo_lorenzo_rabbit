import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  swcMinify: true,
  // Permitir acceso desde otros dispositivos en la red local
  allowedDevOrigins: [
    '192.168.0.0/16',  // Red local común (192.168.x.x)
    '10.0.0.0/8',      // Red local alternativa
    '172.16.0.0/12',   // Red local alternativa
  ],
};

export default nextConfig;
