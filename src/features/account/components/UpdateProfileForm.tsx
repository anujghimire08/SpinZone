"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  UpdateProfileSchema,
  type UpdateProfileSchemaType,
} from "@/features/auth/schemas/auth";

import { updateProfile } from "@/features/account/client/update-profile";

interface UpdateProfileFormProps {
  initialName: string;
}

const UpdateProfileForm = ({ initialName }: UpdateProfileFormProps) => {
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileSchemaType>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      name: initialName,
    },
  });

  const onSubmit = async (values: UpdateProfileSchemaType) => {
    setSuccess("");
    clearErrors("root");

    try {
      const result = await updateProfile({
        name: values.name,
      });

      if (!result.success) {
        setError("root", {
          type: "manual",
          message: result.error,
        });
        return;
      }

      reset({
        name: values.name,
      });

      setSuccess("Profile updated successfully!");

      router.refresh();
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
          htmlFor="name"
          className="block text-sm font-medium text-zinc-700"
        >
          Full Name
        </label>

        <input
          id="name"
          type="text"
          autoComplete="name"
          placeholder="Enter your full name"
          disabled={isSubmitting}
          className="w-full border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 placeholder:text-zinc-400 outline-none transition focus:border-violet-700 focus:ring-2 focus:ring-violet-700/10 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:opacity-60"
          {...register("name")}
        />

        {errors.name && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
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
        {isSubmitting ? "Updating Profile..." : "Update Profile"}
      </button>
    </form>
  );
};

export default UpdateProfileForm;
