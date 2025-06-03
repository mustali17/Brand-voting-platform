import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check for next-auth session token cookie
  const sessionToken =
    request.cookies.get("__Secure-next-auth.session-token")?.value || // production
    request.cookies.get("next-auth.session-token")?.value; // development

  const isAuthenticated = !!sessionToken;
  const { pathname } = request.nextUrl;

  // Allow access to public routes like login, register, api auth, etc.
  const publicPaths = [
    "/login",
    "/register",
    "/api/auth", // next-auth endpoints
    "/_next", // static assets
    "/favicon.ico",
    "/robots.txt",
    "/manifest.json",
    "/terms-and-conditions",
  ];

  const isPublic = publicPaths.some((path) => pathname.startsWith(path));

  if (!isAuthenticated && !isPublic) {
    const loginUrl = new URL("/login", request.url);
    // loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
