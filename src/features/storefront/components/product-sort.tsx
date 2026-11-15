"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const ProductSort = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    params.delete("page");

    const query = params.toString();

    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <select
      aria-label="Sort products"
      value={searchParams.get("sort") ?? "newest"}
      onChange={(event) => updateSort(event.target.value)}
      className="h-12 w-full border border-zinc-300 bg-white px-4 text-sm text-zinc-800 outline-none transition focus:border-violet-600 sm:w-auto"
    >
      <option value="newest">Newest First</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
    </select>
  );
};

export default ProductSort;
