import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware({
  publicRoutes: ["/", "/shop(.*)", "/about", "/contact", "/sign-in", "/sign-up"],
  afterAuth(auth, req) {
    // If trying to access dashboard
    if (req.nextUrl.pathname.startsWith('/dashboard')) {
      // If not signed in or not admin, redirect to home
      if (!auth.userId || auth.sessionClaims?.publicMetadata?.role !== 'admin') {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
    return NextResponse.next();
  },
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
