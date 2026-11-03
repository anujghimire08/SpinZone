import { type SignupSchemaType } from "../schemas/auth";
import { authClient } from "./auth-client";

export const getSignup = async (values: SignupSchemaType) => {
  const { name, email, password } = values;

  const { data, error } = await authClient.signUp.email({
    name,
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
