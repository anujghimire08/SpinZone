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

const selectClassName =
  "h-12 min-w-0 border border-zinc-300 bg-white px-4 text-sm text-zinc-800 outline-none transition focus:border-violet-600";

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
    <div className="flex flex-col gap-3 sm:flex-row">
      <select
        aria-label="Filter by category"
        value={searchParams.get("category") ?? ""}
        onChange={(event) => updateFilter("category", event.target.value)}
        className={selectClassName}
      >
        <option value="">All Categories</option>

        {categories.map((category) => (
          <option key={category.id} value={category.slug}>
            {category.name}
          </option>
        ))}
      </select>

      <select
        aria-label="Filter by brand"
        value={searchParams.get("brand") ?? ""}
        onChange={(event) => updateFilter("brand", event.target.value)}
        className={selectClassName}
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
