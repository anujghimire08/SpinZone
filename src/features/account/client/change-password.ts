import { authClient } from "@/features/auth-client";
interface PasswordChangeProps {
  currentPassword: string;
  newPassword: string;
}
export const passwordChange = async ({
  currentPassword,
  newPassword,
}: PasswordChangeProps) => {
  const { data, error } = await authClient.changePassword({
    currentPassword,
    newPassword,
    revokeOtherSessions: true,
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
