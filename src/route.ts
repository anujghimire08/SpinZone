import { matchesRoute } from "./lib/route-matcher";

/**
 * Routes accessible without authentication.
 */
export const PublicRoutes = [
  "/",
  "/forgot-password",
  "/reset-password",
  "/products/*",
];

export const isPublicRoute = (pathname: string) => {
  return PublicRoutes.some((route) => matchesRoute(pathname, route));
};

/**
 * Authentication-related pages.
 * Logged-in users should not access these pages.
 */
export const AuthRoutes = ["/signin", "/signup"];

/**
 * Prefix for Better Auth API routes.
 */
export const ApiAuthPrefix = "/api/auth";

/**
 * Default destination after successful login.
 */
export const DEFAULT_LOGIN_REDIRECT = "/account";
