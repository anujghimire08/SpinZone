/**
 * Routes accessible without authentication.
 */
export const PublicRoutes = ["/", "/forgot-password", "/reset-password"];

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
