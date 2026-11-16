import Link from "next/link";
import { getStorefrontCategories } from "../queries/get-storefront-categories";

const CategorySection = async () => {
  const categories = await getStorefrontCategories();

  return (
    <section className="bg-[#f7f7f5] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-5 border-b border-zinc-300 pb-7">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-700 sm:text-xs">
              Explore SpinZone
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-[-0.045em] text-zinc-950 sm:text-4xl">
              Find your equipment.
            </h2>
          </div>

          <Link
            href="/categories"
            className="text-sm hidden sm:block font-semibold text-zinc-700 underline decoration-zinc-300 underline-offset-4 transition hover:text-violet-700 hover:decoration-violet-700"
          >
            View all categories <span aria-hidden="true">↗</span>
          </Link>
        </div>

        {categories.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-medium text-zinc-800">
              No categories available yet.
            </p>

            <p className="mt-2 text-sm text-zinc-500">
              Check back soon for available products.
            </p>
          </div>
        ) : (
          <div className="grid grid-flow-col auto-cols-[85%] overflow-x-auto overflow-y-hidden scrollbar-hide overscroll-x-contain sm:auto-cols-[45%] lg:auto-cols-[33.333%]">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                href={`/products?category=${encodeURIComponent(category.slug)}`}
                className="group flex min-h-36 items-center justify-between border-b border-r border-zinc-300 py-7 transition-colors hover:bg-white sm:px-5 lg:min-h-40"
              >
                <div className="flex items-center gap-5">
                  <span className="text-xs tabular-nums text-zinc-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3 className="text-xl font-semibold tracking-tight text-zinc-900 transition-colors group-hover:text-violet-700 sm:text-2xl">
                    {category.name}
                  </h3>
                </div>

                <span
                  aria-hidden="true"
                  className="text-xl text-zinc-400 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-violet-700"
                >
                  ↗
                </span>
              </Link>
            ))}
          </div>
        )}
        <div className="mt-10 sm:hidden">
          <Link
            href="/categories"
            className="block border border-zinc-300 py-3 text-center text-sm font-semibold text-zinc-900 transition hover:border-violet-700 hover:text-violet-700"
          >
            View all categories <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
