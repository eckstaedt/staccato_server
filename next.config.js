/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
}

module.exports = nextConfig
