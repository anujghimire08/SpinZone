"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  DeleteAccountSchema,
  type DeleteAccountSchemaType,
} from "@/features/auth/schemas/auth";

import { deleteAccount } from "@/features/account/client/delete-account";

const DeleteAccountForm = () => {
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<DeleteAccountSchemaType>({
    resolver: zodResolver(DeleteAccountSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = async ({ password }: DeleteAccountSchemaType) => {
    setSuccess("");
    clearErrors("root");

    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your account? This action cannot be undone.",
    );

    if (!confirmed) return;

    const result = await deleteAccount({
      password,
    });

    if (!result.success) {
      setError("root", {
        message: result.error,
      });
      return;
    }

    reset();
    setSuccess("Account deleted successfully.");

    router.replace("/signin");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-zinc-800"
        >
          Current Password
        </label>

        <input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your current password"
          {...register("password")}
          disabled={isSubmitting}
          className="w-full border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 placeholder:text-zinc-400 outline-none transition focus:border-violet-700 focus:ring-2 focus:ring-violet-700/10 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:opacity-60"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "password-error" : undefined}
        />

        {errors.password && (
          <p id="password-error" role="alert" className="text-sm text-red-600">
            {errors.password.message}
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
        className="w-full cursor-pointer bg-red-700 px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Deleting Account..." : "Delete Account"}
      </button>
    </form>
  );
};

export default DeleteAccountForm;
