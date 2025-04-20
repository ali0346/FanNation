import { NextResponse } from "next/server"

// Middleware function to check authentication for protected routes
export function middleware(request) {
  // Get token from cookies or headers
  const token = request.cookies.get("token")?.value || request.headers.get("Authorization")?.split("Bearer ")[1]

  // Check if path requires authentication
  const isProtectedRoute = ["/profile", "/create-thread", "/edit-thread", "/settings", "/notifications"].some((path) =>
    request.nextUrl.pathname.startsWith(path),
  )

  // If it's a protected route and no token exists, redirect to login
  if (isProtectedRoute && !token) {
    // Save the URL they tried to access so we can redirect after login
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// Define which routes this middleware should run on
export const config = {
  matcher: [
    "/profile/:path*",
    "/create-thread/:path*",
    "/edit-thread/:path*",
    "/settings/:path*",
    "/notifications/:path*",
  ],
}
