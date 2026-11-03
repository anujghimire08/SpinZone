import { type LoginSchemaType } from "@/features/auth/schemas/auth";
import { authClient } from "@/features/auth/client/auth-client";

export const getLogin = async (values: LoginSchemaType) => {
  const { email, password } = values;

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
