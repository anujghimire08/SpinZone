import { z } from "zod";

export const SignupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, {
      error: "name is required",
    })
    .max(50, "Password cannot exceed 50 characters"),
  password: z
    .string()
    .trim()
    .min(6, {
      error: "min 6 characters for password",
    })
    .max(128, "Password cannot exceed 128 characters"),
  email: z.string().trim().email({
    error: "invalid email",
  }),
});

export type SignupSchemaType = z.infer<typeof SignupSchema>;
