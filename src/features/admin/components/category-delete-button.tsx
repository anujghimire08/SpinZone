"use client";

import { deleteCategory } from "@/features/admin/actions/category";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

interface Props {
  categoryId: string;
}

const CategoryDeleteButton = ({ categoryId }: Props) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!isModalOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isModalOpen]);

  const handleDelete = () => {
    setError("");

    startTransition(async () => {
      const result = await deleteCategory(categoryId);

      if (!result.success) {
        setError(result.error ?? "Failed to delete category.");
        setIsModalOpen(false);
        return;
      }

      setIsModalOpen(false);
      router.refresh();
    });
  };

  return (
    <>
      <div>
        <button
          type="button"
          onClick={() => {
            setError("");
            setIsModalOpen(true);
          }}
          className="cursor-pointer text-sm font-semibold text-red-600 transition-colors hover:text-red-800"
        >
          Delete
        </button>

        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 p-4 backdrop-blur-[2px]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isPending) {
              setIsModalOpen(false);
            }
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-category-title"
            aria-describedby="delete-category-description"
            className="w-full max-w-md border border-zinc-200 bg-white p-6 shadow-xl"
          >
            <div className="flex size-12 items-center justify-center bg-red-50 text-red-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
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
              id="delete-category-title"
              className="mt-5 text-lg font-semibold text-zinc-950"
            >
              Delete Category?
            </h2>

            <p
              id="delete-category-description"
              className="mt-2 text-sm leading-6 text-zinc-500"
            >
              Are you sure you want to delete this category? This action cannot
              be undone.
            </p>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                disabled={isPending}
                className="cursor-pointer border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="cursor-pointer bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Deleting..." : "Delete Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryDeleteButton;
