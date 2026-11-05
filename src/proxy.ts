import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  PublicRoutes,
  AuthRoutes,
  ApiAuthPrefix,
  DEFAULT_LOGIN_REDIRECT,
} from "@/route";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isApiAuthRoute = pathname.startsWith(ApiAuthPrefix);
  const isAuthRoute = AuthRoutes.includes(pathname);
  const isPublicRoute = PublicRoutes.includes(pathname);

  if (isApiAuthRoute) {
    return NextResponse.next();
  }
  if (isPublicRoute) {
    return NextResponse.next();
  }
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const isLoggedIn = !!session;

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(
        new URL(DEFAULT_LOGIN_REDIRECT, request.url),
      );
    }
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
