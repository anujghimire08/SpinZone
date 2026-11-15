import Link from "next/link";
import { getProducts } from "@/features/admin/queries/get-products";
import ProductCard from "./product-card";

const FeaturedProducts = async () => {
  const result = await getProducts({
    isActive: true,
    currentPage: 1,
    perPage: 8,
  });

  const products = result.products;

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5 border-b border-zinc-200 pb-7">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-700 sm:text-xs">
              The SpinZone selection
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.045em] text-zinc-950 sm:text-4xl">
              Shop equipment.
            </h2>
            <p className="mt-3 text-sm text-zinc-500">
              Browse our latest available products.
            </p>
          </div>

          <Link
            href="/products"
            className="hidden text-sm font-semibold text-zinc-800 underline decoration-zinc-300 underline-offset-4 transition hover:text-violet-700 hover:decoration-violet-700 sm:block"
          >
            View all products <span aria-hidden="true">↗</span>
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-medium text-zinc-800">
              No products available yet.
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              New products will appear here when available.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-7">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-10 sm:hidden">
          <Link
            href="/products"
            className="block border border-zinc-300 py-3 text-center text-sm font-semibold text-zinc-900 transition hover:border-violet-700 hover:text-violet-700"
          >
            View all products <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
