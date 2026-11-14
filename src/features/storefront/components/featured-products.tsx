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
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            Our Collection
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Featured Products
          </h2>

          <p className="mt-3 text-zinc-400">
            Discover equipment designed to elevate your game.
          </p>
        </div>

        <Link
          href="/products"
          className="hidden text-sm font-semibold text-violet-400 transition hover:text-violet-300 sm:block"
        >
          View All Products →
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="py-12 text-center text-zinc-400">
          No products available yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <Link
        href="/products"
        className="mt-8 block text-center text-sm font-semibold text-violet-400 sm:hidden"
      >
        View All Products →
      </Link>
    </section>
  );
};

export default FeaturedProducts;
