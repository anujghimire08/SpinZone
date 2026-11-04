"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  UpdateProfileSchema,
  type UpdateProfileSchemaType,
} from "@/features/auth/schemas/auth";

import { updateProfile } from "@/features/auth/client/update-profile";

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
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileSchemaType>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      name: initialName,
    },
  });

  const onSubmit = async (values: UpdateProfileSchemaType) => {
    setSuccess("");

    const result = await updateProfile({
      name: values.name,
    });

    if (!result.success) {
      setError("root", {
        message: result.error,
      });
      return;
    }

    reset({
      name: values.name,
    });

    setSuccess("Profile updated successfully!");

    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name">Full Name</label>

        <input
          id="name"
          type="text"
          {...register("name")}
          disabled={isSubmitting}
        />

        {errors.name && <p>{errors.name.message}</p>}
      </div>

      {errors.root && <p>{errors.root.message}</p>}

      {success && <p>{success}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Updating Profile..." : "Update Profile"}
      </button>
    </form>
  );
};

export default UpdateProfileForm;
