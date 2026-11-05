import { authClient } from "@/features/auth/client/auth-client";

interface ResetPasswordProps {
  newPassword: string;
  token: string;
}

export const resetPassword = async ({
  newPassword,
  token,
}: ResetPasswordProps) => {
  const { data, error } = await authClient.resetPassword({
    newPassword,
    token,
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
