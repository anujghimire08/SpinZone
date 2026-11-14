import Link from "next/link";
import { getStorefrontCategories } from "../queries/get-storefront-categories";

const CategorySection = async () => {
  const categories = await getStorefrontCategories();

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            Explore our collection
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Shop by Category
          </h2>

          <p className="mt-3 text-zinc-400">
            Find the right equipment for your game.
          </p>
        </div>

        <Link
          href="/products"
          className="text-sm font-semibold text-violet-400 transition hover:text-violet-300"
        >
          View all products →
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-zinc-900 p-10 text-center">
          <p className="font-semibold">No categories available yet.</p>
          <p className="mt-2 text-sm text-zinc-500">
            Check back soon for new collections.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${encodeURIComponent(category.slug)}`}
              className="group flex min-h-52 flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-800 to-zinc-950 p-7 transition duration-300 hover:-translate-y-1 hover:border-violet-500/50"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                SpinZone Collection
              </span>

              <div>
                <h3 className="text-2xl font-bold transition group-hover:text-violet-400">
                  {category.name}
                </h3>

                <p className="mt-3 text-sm text-zinc-400">
                  Explore collection
                  <span className="ml-2 inline-block transition group-hover:translate-x-1">
                    →
                  </span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default CategorySection;
