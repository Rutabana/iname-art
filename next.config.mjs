/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d3s90ejqky0l1n.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
