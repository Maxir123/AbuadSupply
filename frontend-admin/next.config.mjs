/** @type {import('next').NextConfig} */
const NEXT_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://backend:8000";

const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
    ],
  },
  async rewrites() {
    return [
      { source: "/api/:path((?!auth).*)", destination: `${NEXT_API_URL}/api/:path*` },
    ];
  },
  compress: true,
};

export default nextConfig;
