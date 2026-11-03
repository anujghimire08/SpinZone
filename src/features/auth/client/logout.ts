import { authClient } from "@/features/auth/client/auth-client";

export const getLogout = async () => {
  const { data, error } = await authClient.signOut();

  if (error) {
    return {
      success: false as const,
      error: error.message,
    };
  }

  return {
    success: true as const,
    data,
  };
};
