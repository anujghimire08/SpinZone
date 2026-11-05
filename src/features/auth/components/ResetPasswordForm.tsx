"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ResetPasswordSchema,
  type ResetPasswordSchemaType,
} from "@/features/auth/schemas/auth";

import { resetPassword } from "@/features/auth/client/reset-password";

interface ResetPasswordFormProps {
  token: string;
}

const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordSchemaType) => {
    setSuccess("");

    const result = await resetPassword({
      newPassword: values.newPassword,
      token,
    });

    if (!result.success) {
      setError("root", {
        message: result.error,
      });
      return;
    }

    reset();
    setSuccess("Password reset successfully!");

    router.replace("/signin");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="newPassword">New Password</label>

        <input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          {...register("newPassword")}
          disabled={isSubmitting}
        />

        {errors.newPassword && <p>{errors.newPassword.message}</p>}
      </div>

      <div>
        <label htmlFor="confirmPassword">Confirm New Password</label>

        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          {...register("confirmPassword")}
          disabled={isSubmitting}
        />

        {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
      </div>

      {errors.root && <p>{errors.root.message}</p>}

      {success && <p>{success}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Resetting Password..." : "Reset Password"}
      </button>
    </form>
  );
};

export default ResetPasswordForm;
