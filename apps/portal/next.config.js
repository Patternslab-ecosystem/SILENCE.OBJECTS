/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@silence/ui',
    '@silence/contracts',
    '@silence/events',
  ],
}
module.exports = nextConfig
