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
      value={searchParams.get("sort") ?? "newest"}
      onChange={(event) => updateSort(event.target.value)}
      className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
    >
      <option value="newest">Newest First</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
    </select>
  );
};

export default ProductSort;
