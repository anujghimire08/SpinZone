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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="newEmail">New Email Address</label>

        <input
          id="newEmail"
          type="email"
          autoComplete="email"
          {...register("newEmail")}
          disabled={isSubmitting}
        />

        {errors.newEmail && (
          <p className="text-red-600">{errors.newEmail.message}</p>
        )}
      </div>

      {errors.root && <p className="text-red-600">{errors.root.message}</p>}

      {success && <p className="text-green-600">{success}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Change Email"}
      </button>
    </form>
  );
};

export default ChangeEmailForm;
