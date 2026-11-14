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
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-12">
      <div className="mb-10">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
          Explore Our Collection
        </p>

        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Shop All Products
        </h1>

        <p className="mt-3 text-zinc-400">
          Discover the right equipment for your game.
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ProductSearch />
        <ProductFilters
          categories={filters.categories}
          brands={filters.brands}
        />
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-400">
          {result.totalData} products found
        </p>

        <ProductSort />
      </div>

      {result.products.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-zinc-900 px-6 py-16 text-center">
          <h2 className="text-xl font-semibold text-white">
            No products found
          </h2>

          <p className="mt-2 text-zinc-400">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
