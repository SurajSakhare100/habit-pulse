import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Check if the token exists (user is authenticated)
    },
    pages: {
      signIn: "/auth/signin", // Redirect to sign-in page if not authorized
    },
  }
);

export const config = {
  matcher: [
    "/habits/:path*",    
    "/profile",         
    "/feedback",        
  ],
};
