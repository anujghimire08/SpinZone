import { authClient } from "@/features/auth/client/auth-client";

interface ForgotPasswordProps {
  email: string;
}

export const forgotPassword = async ({ email }: ForgotPasswordProps) => {
  const { data, error } = await authClient.requestPasswordReset({
    email,
    redirectTo: `${window.location.origin}/reset-password`,
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
