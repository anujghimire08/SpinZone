import Link from "next/link";
import { getCategories } from "@/features/admin/queries/get-categories";

const CategoriesPage = async () => {
  const categories = await getCategories();

  return (
    <section className="bg-[#f7f7f5] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-5 border-b border-zinc-300 pb-7">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-700 sm:text-xs">
              Explore SpinZone
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-[-0.045em] text-zinc-950 sm:text-4xl">
              All categories.
            </h1>
          </div>

          <p className="text-sm text-zinc-500">
            {categories.length} categories
          </p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                href={`/products?category=${encodeURIComponent(category.slug)}`}
                className="group flex min-h-36 items-center justify-between border-b border-zinc-300 py-7 transition-colors hover:bg-white sm:px-5 lg:min-h-40"
              >
                <div className="flex items-center gap-5">
                  <span className="text-xs tabular-nums text-zinc-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h2 className="text-xl font-semibold tracking-tight text-zinc-900 transition-colors group-hover:text-violet-700 sm:text-2xl">
                    {category.name}
                  </h2>
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
      </div>
    </section>
  );
};

export default CategoriesPage;
