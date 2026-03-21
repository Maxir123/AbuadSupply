/** @type {import('next').NextConfig} */
const NEXT_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const nextConfig = {
  output: 'standalone',
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" },
    ],
    minimumCacheTTL: 60,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path((?!auth).*)",
        destination: `${NEXT_API_URL}/api/:path*`,
      },
    ];
  },
  compress: true,
};
export default nextConfig;
