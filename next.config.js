/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    turbo: {
      rules: {
        // Option to enable client-side hooks in server components
        "no-client-hooks": false
      }
    }
  }
};

module.exports = nextConfig;
