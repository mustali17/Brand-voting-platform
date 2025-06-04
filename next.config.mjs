/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // allows all HTTPS domains
      },
      {
        protocol: "http",
        hostname: "**", // allows all HTTPS domains
      },
    ],
    dangerouslyAllowSVG: true,
  },
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|manifest.json|login|register|terms-and-conditions|api/auth).*)",
  ],
};

export default nextConfig;
