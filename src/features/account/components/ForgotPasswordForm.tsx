"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPassword } from "@/features/account/client/forgot-password";
import {
  ForgotPasswordSchema,
  ForgotPasswordSchemaType,
} from "@/features/auth/schemas/auth";

const ForgotPasswordForm = () => {
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordSchemaType) => {
    setSuccess("");
    clearErrors("root");

    try {
      const result = await forgotPassword({
        email: values.email,
      });

      if (!result.success) {
        setError("root", {
          message: result.error,
        });
        return;
      }

      reset();
      setSuccess(
        "If an account exists with this email, you will receive a password reset link.",
      );
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
          htmlFor="email"
          className="block text-sm font-medium text-zinc-800"
        >
          Email Address
        </label>

        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...register("email")}
          disabled={isSubmitting}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          className="w-full border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 placeholder:text-zinc-400 outline-none transition focus:border-violet-700 focus:ring-2 focus:ring-violet-700/10 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:opacity-60"
        />

        {errors.email && (
          <p id="email-error" role="alert" className="text-sm text-red-600">
            {errors.email.message}
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
          className="border border-green-200 bg-green-50 px-4 py-3 text-sm leading-6 text-green-700"
        >
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full cursor-pointer bg-violet-700 px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Sending..." : "Send Reset Link"}
      </button>
    </form>
  );
};

export default ForgotPasswordForm;
