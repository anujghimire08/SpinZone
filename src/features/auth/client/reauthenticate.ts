import { authClient } from "@/features/auth/client/auth-client";

export const reauthenticate = async (email: string, password: string) => {
  const { data, error } = await authClient.signIn.email({
    email,
    password,
  });

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
