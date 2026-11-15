"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ResetPasswordSchema,
  type ResetPasswordSchemaType,
} from "@/features/auth/schemas/auth";
import { resetPassword } from "@/features/account/client/reset-password";

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
    clearErrors,
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
    clearErrors("root");

    try {
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
    } catch {
      setError("root", {
        message: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label
          htmlFor="newPassword"
          className="block text-sm font-medium text-zinc-800"
        >
          New Password
        </label>

        <input
          id="newPassword"
          type="password"
          placeholder="Enter your new password"
          autoComplete="new-password"
          {...register("newPassword")}
          disabled={isSubmitting}
          aria-invalid={Boolean(errors.newPassword)}
          aria-describedby={
            errors.newPassword ? "newPassword-error" : undefined
          }
          className="w-full border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 placeholder:text-zinc-400 outline-none transition focus:border-violet-700 focus:ring-2 focus:ring-violet-700/10 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:opacity-60"
        />

        {errors.newPassword && (
          <p
            id="newPassword-error"
            role="alert"
            className="text-sm text-red-600"
          >
            {errors.newPassword.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-zinc-800"
        >
          Confirm New Password
        </label>

        <input
          id="confirmPassword"
          type="password"
          placeholder="Confirm your new password"
          autoComplete="new-password"
          {...register("confirmPassword")}
          disabled={isSubmitting}
          aria-invalid={Boolean(errors.confirmPassword)}
          aria-describedby={
            errors.confirmPassword ? "confirmPassword-error" : undefined
          }
          className="w-full border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 placeholder:text-zinc-400 outline-none transition focus:border-violet-700 focus:ring-2 focus:ring-violet-700/10 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:opacity-60"
        />

        {errors.confirmPassword && (
          <p
            id="confirmPassword-error"
            role="alert"
            className="text-sm text-red-600"
          >
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {errors.root && (
        <p
          role="alert"
          className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errors.root.message}
        </p>
      )}

      {success && (
        <p
          role="status"
          className="border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
        >
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full cursor-pointer bg-violet-700 px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Resetting Password..." : "Reset Password"}
      </button>
    </form>
  );
};

export default ResetPasswordForm;
