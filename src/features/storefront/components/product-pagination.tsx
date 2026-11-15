"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
}

const ProductPagination = ({
  currentPage,
  totalPages,
}: ProductPaginationProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const changePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));

    const query = params.toString();
    router.push(`${pathname}?${query}`);
  };

  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  const pages = getPageNumbers();

  const buttonBase =
    "flex h-10 min-w-10 items-center justify-center border px-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <nav
      aria-label="Product pagination"
      className="mt-12 flex flex-wrap items-center justify-center gap-2 border-t border-zinc-200 pt-8"
    >
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => changePage(currentPage - 1)}
        className={`${buttonBase} border-zinc-300 text-zinc-700 hover:border-violet-600 hover:text-violet-700`}
      >
        Previous
      </button>

      {pages.map((page, index) =>
        page === "..." ? (
          <span key={`ellipsis-${index}`} className="px-2 text-zinc-400">
            ...
          </span>
        ) : (
          <button
            key={page}
            type="button"
            aria-current={currentPage === page ? "page" : undefined}
            onClick={() => changePage(page)}
            className={`${buttonBase} ${
              currentPage === page
                ? "border-violet-700 bg-violet-700 text-white"
                : "border-zinc-300 text-zinc-700 hover:border-violet-600 hover:text-violet-700"
            }`}
          >
            {page}
          </button>
        ),
      )}

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => changePage(currentPage + 1)}
        className={`${buttonBase} border-zinc-300 text-zinc-700 hover:border-violet-600 hover:text-violet-700`}
      >
        Next
      </button>
    </nav>
  );
};

export default ProductPagination;
