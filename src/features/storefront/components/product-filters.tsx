"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface ProductFiltersProps {
  categories: {
    id: string;
    name: string;
    slug: string;
  }[];
  brands: string[];
}

const ProductFilters = ({ categories, brands }: ProductFiltersProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.delete("page");

    const query = params.toString();

    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <select
        value={searchParams.get("category") ?? ""}
        onChange={(event) => updateFilter("category", event.target.value)}
        className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
      >
        <option value="">All Categories</option>

        {categories.map((category) => (
          <option key={category.id} value={category.slug}>
            {category.name}
          </option>
        ))}
      </select>

      <select
        value={searchParams.get("brand") ?? ""}
        onChange={(event) => updateFilter("brand", event.target.value)}
        className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
      >
        <option value="">All Brands</option>

        {brands.map((brand) => (
          <option key={brand} value={brand}>
            {brand}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProductFilters;
