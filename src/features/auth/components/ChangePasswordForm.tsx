"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ChangePasswordSchema,
  type ChangePasswordSchemaType,
} from "@/features/auth/schemas/auth";

import { passwordChange } from "@/features/auth/client/change-password";

const ChangePasswordForm = () => {
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setError,
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
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="currentPassword">Current Password</label>
        <input
          id="currentPassword"
          type="password"
          {...register("currentPassword")}
        />
        {errors.currentPassword && <p>{errors.currentPassword.message}</p>}
      </div>

      <div>
        <label htmlFor="newPassword">New Password</label>
        <input id="newPassword" type="password" {...register("newPassword")} />
        {errors.newPassword && <p>{errors.newPassword.message}</p>}
      </div>

      <div>
        <label htmlFor="confirmPassword">Confirm New Password</label>
        <input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
      </div>

      {errors.root && <p>{errors.root.message}</p>}

      {success && <p>{success}</p>}

      <button
        type="submit"
        className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Changing Password..." : "Change Password"}
      </button>
    </form>
  );
};

export default ChangePasswordForm;
