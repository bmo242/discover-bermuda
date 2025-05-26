import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === "ADMIN";
    const isProtectedRoute = req.nextUrl.pathname.startsWith("/admin");

    // Redirect non-admin users trying to access admin routes
    if (isProtectedRoute && !isAdmin) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
);

// Protect all routes under /admin and /api/admin
export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/locations/:path*"]
}; 