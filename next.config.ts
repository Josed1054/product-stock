import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    const useMock = (process.env.NEXT_PUBLIC_USE_MOCK_API || '').toLowerCase();
    if (useMock === '1' || useMock === 'true') return [];
    const target = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.VITE_API_BASE_URL;
    if (!target) return [];
    return [
      {
        source: '/api/:path*',
        destination: `${target}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
