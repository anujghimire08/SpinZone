"use client";

import { deleteCategory } from "@/features/admin/actions/category";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface Props {
  categoryId: string;
}

const CategoryDeleteButton = ({ categoryId }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?",
    );

    if (!confirmed) return;

    setError("");

    startTransition(async () => {
      const result = await deleteCategory(categoryId);

      if (!result.success) {
        setError(result.error ?? "Failed to delete category.");
        return;
      }

      router.refresh();
    });
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50"
      >
        {isPending ? "Deleting..." : "Delete"}
      </button>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default CategoryDeleteButton;
