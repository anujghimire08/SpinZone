"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ChangeEmailSchema,
  type ChangeEmailSchemaType,
} from "@/features/auth/schemas/auth";

import { emailChange } from "@/features/account/client/change-email";

const ChangeEmailForm = () => {
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<ChangeEmailSchemaType>({
    resolver: zodResolver(ChangeEmailSchema),
    defaultValues: {
      newEmail: "",
    },
  });

  const onSubmit = async ({ newEmail }: ChangeEmailSchemaType) => {
    setSuccess("");
    clearErrors("root");

    const result = await emailChange(newEmail);

    if (!result.success) {
      setError("root", {
        message: result.error,
      });
      return;
    }

    setSuccess(
      "If the email address can be used, a verification email will be sent.",
    );

    reset();
  };

  const fieldClassName =
    "w-full border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 placeholder:text-zinc-400 outline-none transition focus:border-violet-700 focus:ring-2 focus:ring-violet-700/10 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:opacity-60";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label
          htmlFor="newEmail"
          className="block text-sm font-medium text-zinc-800"
        >
          New Email Address
        </label>

        <input
          id="newEmail"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...register("newEmail")}
          disabled={isSubmitting}
          className={fieldClassName}
          aria-invalid={Boolean(errors.newEmail)}
          aria-describedby={errors.newEmail ? "newEmail-error" : undefined}
        />

        {errors.newEmail && (
          <p id="newEmail-error" role="alert" className="text-sm text-red-600">
            {errors.newEmail.message}
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
        {isSubmitting ? "Sending..." : "Change Email"}
      </button>
    </form>
  );
};

export default ChangeEmailForm;
