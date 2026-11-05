import { authClient } from "@/features/auth/client/auth-client";

interface DeleteAccountProps {
  password: string;
}

export const deleteAccount = async ({ password }: DeleteAccountProps) => {
  const { data, error } = await authClient.deleteUser({
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
