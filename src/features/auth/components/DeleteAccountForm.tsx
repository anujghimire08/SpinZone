"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  DeleteAccountSchema,
  type DeleteAccountSchemaType,
} from "@/features/auth/schemas/auth";

import { deleteAccount } from "@/features/auth/client/delete-account";

const DeleteAccountForm = () => {
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<DeleteAccountSchemaType>({
    resolver: zodResolver(DeleteAccountSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = async ({ password }: DeleteAccountSchemaType) => {
    setSuccess("");

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="password">Current Password</label>

        <input
          id="password"
          type="password"
          autoComplete="current-password"
          {...register("password")}
          disabled={isSubmitting}
        />

        {errors.password && <p>{errors.password.message}</p>}
      </div>

      {errors.root && <p>{errors.root.message}</p>}

      {success && <p>{success}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Deleting Account..." : "Delete Account"}
      </button>
    </form>
  );
};

export default DeleteAccountForm;
