/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@silence/ui", "@silence/contracts"],
};

module.exports = nextConfig;
