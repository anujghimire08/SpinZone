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
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name">Category name</label>

        <input
          id="name"
          {...register("name")}
          placeholder="e.g. Table Tennis"
          className="w-full rounded border p-2"
        />

        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {serverError && <p className="text-sm text-red-500">{serverError}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {isSubmitting ? "Creating..." : "Create Category"}
      </button>
    </form>
  );
};

export default CategoryForm;
