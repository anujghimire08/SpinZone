"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
} from "@/features/admin/schemas/category";
import {
  createCategory,
  updateCategory,
} from "@/features/admin/actions/category";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CategoryFormProps {
  category?: {
    id: string;
    name: string;
  };
}

const CategoryForm = ({ category }: CategoryFormProps) => {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCategorySchemaType>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      name: category?.name ?? "",
    },
  });

  const onSubmit = async (data: CreateCategorySchemaType) => {
    setServerError("");

    try {
      const result = category
        ? await updateCategory(category.id, data)
        : await createCategory(data);

      if (!result.success) {
        setServerError(result.error ?? "Something went wrong.");
        return;
      }

      reset();
      router.refresh();
      router.replace("/admin/categories");
    } catch {
      setServerError("Something went wrong. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 border border-zinc-200 bg-white p-5 sm:p-6"
    >
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-zinc-700"
        >
          Category Name
        </label>

        <input
          id="name"
          type="text"
          placeholder="e.g. Table Tennis"
          disabled={isSubmitting}
          className="w-full border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 placeholder:text-zinc-400 outline-none transition focus:border-violet-700 focus:ring-2 focus:ring-violet-700/10 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:opacity-60"
          {...register("name")}
        />

        {errors.name && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {serverError && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full cursor-pointer bg-violet-700 px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting
          ? category
            ? "Updating Category..."
            : "Creating Category..."
          : category
            ? "Update Category"
            : "Create Category"}
      </button>
    </form>
  );
};

export default CategoryForm;
