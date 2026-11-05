import { authClient } from "@/features/auth-client";

export const emailChange = async (email: string) => {
  const { data, error } = await authClient.changeEmail({
    newEmail: email,
    callbackURL: "/account",
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
