/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['@repo/ui'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },

  transpilePackages: ['@repo/ui'],
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@repo/ui': require.resolve('@repo/ui'),
    };
    return config;
  },
};

module.exports = nextConfig;
