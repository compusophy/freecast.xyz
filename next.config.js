/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true
  },
  transpilePackages: [
    "@farcaster/frame-wagmi-connector",
    "@farcaster/frame-sdk",
    "wagmi",
    "viem"
  ],
  experimental: {
    esmExternals: false
  }
};

module.exports = nextConfig;