"use client";

import { FormEvent, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const ProductSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    if (search.trim()) {
      params.set("search", search.trim());
    } else {
      params.delete("search");
    }

    params.delete("page");

    const query = params.toString();

    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-xl gap-2">
      <div className="relative min-w-0 flex-1">
        <svg
          aria-hidden="true"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>

        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search products, brands..."
          className="h-12 w-full border border-zinc-300 bg-white pl-11 pr-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-violet-600"
        />
      </div>

      <button
        type="submit"
        className="h-12 bg-violet-700 px-5 text-sm font-semibold text-white transition-colors hover:bg-violet-600"
      >
        Search
      </button>
    </form>
  );
};

export default ProductSearch;
