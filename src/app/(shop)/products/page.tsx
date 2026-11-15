import ProductCard from "@/features/storefront/components/product-card";
import ProductSearch from "@/features/storefront/components/product-search";
import { getStorefrontProducts } from "@/features/storefront/queries/get-storefront-products";
import ProductFilters from "@/features/storefront/components/product-filters";
import { getStorefrontFilters } from "@/features/storefront/queries/get-storefront-filters";
import ProductSort from "@/features/storefront/components/product-sort";
import ProductPagination from "@/features/storefront/components/product-pagination";

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    brand?: string;
    sort?: "newest" | "price-asc" | "price-desc";
    page?: string;
  }>;
}

const ProductsPage = async ({ searchParams }: ProductsPageProps) => {
  const params = await searchParams;
  const currentPage = Math.max(1, Number(params.page) || 1);

  const [result, filters] = await Promise.all([
    getStorefrontProducts({
      search: params.search,
      category: params.category,
      brand: params.brand,
      sort: params.sort,
      currentPage,
      perPage: 12,
    }),
    getStorefrontFilters(),
  ]);

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-5 py-12 sm:px-6 lg:py-16">
      <div className="mb-10 border-b border-zinc-200 pb-8">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-violet-700 sm:text-xs">
          Explore our collection
        </p>

        <h1 className="text-3xl font-bold tracking-[-0.045em] text-zinc-950 sm:text-4xl lg:text-5xl">
          Shop all products
        </h1>

        <p className="mt-4 max-w-lg text-sm leading-7 text-zinc-600 sm:text-base">
          Discover table tennis equipment that fits your game.
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ProductSearch />
        <ProductFilters
          categories={filters.categories}
          brands={filters.brands}
        />
      </div>

      <div className="mb-6 flex flex-col gap-4 border-b border-zinc-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-600">
          <span className="font-semibold text-zinc-950">
            {result.totalData}
          </span>{" "}
          products found
        </p>

        <ProductSort />
      </div>

      {result.products.length === 0 ? (
        <div className="border border-zinc-200 bg-white px-6 py-16 text-center">
          <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
            No products found
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {result.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <ProductPagination
            currentPage={result.page}
            totalPages={result.totalPages}
          />
        </>
      )}
    </main>
  );
};

export default ProductsPage;
