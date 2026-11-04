import { authClient } from "@/features/auth/client/auth-client";

interface UpdateProfileProps {
  name: string;
}

export const updateProfile = async ({ name }: UpdateProfileProps) => {
  const { data, error } = await authClient.updateUser({
    name,
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
