/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // allows all HTTPS domains
      },
      {
        protocol: 'http',
        hostname: '**', // allows all HTTPS domains
      },
    ],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
