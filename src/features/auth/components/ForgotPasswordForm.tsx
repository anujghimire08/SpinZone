"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { forgotPassword } from "@/features/auth/client/forgot-password";
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
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordSchemaType) => {
    setSuccess("");

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
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="email">Email Address</label>

        <input
          id="email"
          type="email"
          autoComplete="email"
          {...register("email")}
          disabled={isSubmitting}
        />

        {errors.email && <p>{errors.email.message}</p>}
      </div>

      {errors.root && <p>{errors.root.message}</p>}

      {success && <p>{success}</p>}

      <button
        type="submit"
        className="rounded-md border px-4 py-2"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Send Reset Link"}
      </button>
    </form>
  );
};

export default ForgotPasswordForm;
