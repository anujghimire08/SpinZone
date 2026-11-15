"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ChangePasswordSchema,
  type ChangePasswordSchemaType,
} from "@/features/auth/schemas/auth";

import { passwordChange } from "@/features/account/client/change-password";

const inputClassName =
  "w-full border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 placeholder:text-zinc-400 outline-none transition focus:border-violet-700 focus:ring-2 focus:ring-violet-700/10 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:opacity-60";

const ChangePasswordForm = () => {
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordSchemaType>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async ({
    currentPassword,
    newPassword,
  }: ChangePasswordSchemaType) => {
    setSuccess("");
    clearErrors("root");

    try {
      const result = await passwordChange({ currentPassword, newPassword });

      if (!result.success) {
        setError("root", {
          type: "manual",
          message: result.error,
        });
        return;
      }

      reset();
      setSuccess("Password changed successfully!");
    } catch {
      setError("root", {
        type: "manual",
        message: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <label
          htmlFor="currentPassword"
          className="block text-sm font-medium text-zinc-700"
        >
          Current Password
        </label>

        <input
          id="currentPassword"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your current password"
          className={inputClassName}
          disabled={isSubmitting}
          {...register("currentPassword")}
        />

        {errors.currentPassword && (
          <p className="text-sm text-red-600">
            {errors.currentPassword.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="newPassword"
          className="block text-sm font-medium text-zinc-700"
        >
          New Password
        </label>

        <input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Enter your new password"
          className={inputClassName}
          disabled={isSubmitting}
          {...register("newPassword")}
        />

        {errors.newPassword && (
          <p className="text-sm text-red-600">{errors.newPassword.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-zinc-700"
        >
          Confirm New Password
        </label>

        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Confirm your new password"
          className={inputClassName}
          disabled={isSubmitting}
          {...register("confirmPassword")}
        />

        {errors.confirmPassword && (
          <p className="text-sm text-red-600">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {errors.root && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errors.root.message}
        </div>
      )}

      {success && (
        <div className="border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full cursor-pointer bg-violet-700 px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Changing Password..." : "Change Password"}
      </button>
    </form>
  );
};

export default ChangePasswordForm;
