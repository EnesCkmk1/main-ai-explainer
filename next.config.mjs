/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Tillad større request-bodies på server actions / route handlers (store PDF'er).
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
};

export default nextConfig;
