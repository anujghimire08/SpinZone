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

export const LoginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),

    newPassword: z.string().min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine(
    ({ newPassword, confirmPassword }) => newPassword === confirmPassword,
    {
      error: "Passwords do not match",
      path: ["confirmPassword"],
    },
  )
  .refine(
    ({ currentPassword, newPassword }) => currentPassword !== newPassword,
    {
      error: "New password must be different from current password",
      path: ["newPassword"],
    },
  );

export type ChangePasswordSchemaType = z.infer<typeof ChangePasswordSchema>;
