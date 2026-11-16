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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<DeleteAccountSchemaType>({
    resolver: zodResolver(DeleteAccountSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = () => {
    setSuccess("");
    clearErrors("root");
    setIsModalOpen(true);
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    clearErrors("root");

    try {
      const result = await deleteAccount({
        password: getValues("password"),
      });

      if (!result.success) {
        setError("root", {
          message: result.error,
        });
        setIsModalOpen(false);
        return;
      }

      reset();
      setSuccess("Account deleted successfully.");
      setIsModalOpen(false);

      router.replace("/signin");
    } catch {
      setError("root", {
        message: "Something went wrong. Please try again.",
      });
      setIsModalOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
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
            disabled={isSubmitting || isDeleting}
            className="w-full border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 placeholder:text-zinc-400 outline-none transition focus:border-violet-700 focus:ring-2 focus:ring-violet-700/10 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:opacity-60"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
          />

          {errors.password && (
            <p
              id="password-error"
              role="alert"
              className="text-sm text-red-600"
            >
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
          disabled={isSubmitting || isDeleting}
          className="w-full cursor-pointer bg-red-700 px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Delete Account
        </button>
      </form>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => !isDeleting && setIsModalOpen(false)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-account-title"
            aria-describedby="delete-account-description"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md border border-zinc-200 bg-white p-6 shadow-xl sm:p-8"
          >
            <div className="flex size-12 items-center justify-center bg-red-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-red-600"
                aria-hidden="true"
              >
                <path d="M3 6h18" />
                <path d="M8 6V4h8v2" />
                <path d="m19 6-1 14H6L5 6" />
                <path d="M10 11v5" />
                <path d="M14 11v5" />
              </svg>
            </div>

            <h2
              id="delete-account-title"
              className="mt-5 text-xl font-semibold tracking-tight text-zinc-950"
            >
              Delete your account?
            </h2>

            <p
              id="delete-account-description"
              className="mt-2 text-sm leading-6 text-zinc-500"
            >
              Are you sure you want to permanently delete your account? This
              action cannot be undone.
            </p>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setIsModalOpen(false)}
                className="border border-zinc-300 px-5 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteAccount}
                className="bg-red-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete My Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteAccountForm;
