/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    turbo: {
      rules: {
        // Option to enable client-side hooks in server components
        "no-client-hooks": false
      }
    },
    serverActions: {
      allowedOrigins: ['localhost:3000']
    }
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
};

module.exports = nextConfig;
