import { authClient } from "./auth-client";
// SESSION REVOCATION

/**
 * Gets the session belonging to the current browser.
 */
export const getCurrentSession = async () => {
  return await authClient.getSession();
};

/**
 * Lists all sessions for the current user.
 */
export const getSessions = async () => {
  return await authClient.listSessions();
};

/**
 * Revokes a selected session.
 * @param token @type {string} - The token identifying the session to revoke.
 * @returns Information about the revoked session.
 */
export const revokeSession = async (token: string) => {
  return await authClient.revokeSession({ token });
};

/**
 * Revokes all sessions except the current one.
 */
export const revokeOtherSessions = async () => {
  return await authClient.revokeOtherSessions();
};

/**
 * Revokes all sessions for the current user.
 */
export const revokeSessions = async () => {
  return await authClient.revokeSessions();
};
