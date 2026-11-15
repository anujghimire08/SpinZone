import CategoryDeleteButton from "@/features/admin/components/category-delete-button";
import CategoryForm from "@/features/admin/components/category-form";
import { getCategories } from "@/features/admin/queries/get-categories";
import Link from "next/link";

const CategoriesPage = async () => {
  const categories = await getCategories();

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-6 py-10 sm:px-8">
      <div className="flex flex-col gap-4 border-b border-zinc-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
            Product Management
          </p>

          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
            Categories
          </h1>

          <p className="text-sm leading-6 text-zinc-500">
            Manage your product categories.
          </p>
        </div>

        <div className="border border-zinc-200 bg-white px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Total Categories
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-zinc-950">
            {categories.length}
          </p>
        </div>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-950">
            All Categories
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            View and manage your existing categories.
          </p>
        </div>

        <div className="overflow-x-auto border border-zinc-200 bg-white">
          <table className="w-full min-w-175 text-left text-sm">
            <thead className="bg-zinc-50">
              <tr className="border-b border-zinc-200">
                <th className="px-5 py-4 font-semibold text-zinc-600">Name</th>
                <th className="px-5 py-4 font-semibold text-zinc-600">Slug</th>
                <th className="px-5 py-4 font-semibold text-zinc-600">
                  Products
                </th>
                <th className="px-5 py-4 font-semibold text-zinc-600">
                  Created At
                </th>
                <th className="px-5 py-4 font-semibold text-zinc-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-200">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr
                    key={category.id}
                    className="transition-colors hover:bg-zinc-50"
                  >
                    <td className="px-5 py-4 font-medium text-zinc-950">
                      {category.name}
                    </td>

                    <td className="px-5 py-4 text-zinc-500">{category.slug}</td>

                    <td className="px-5 py-4 text-zinc-700">
                      {category._count.product}
                    </td>

                    <td className="px-5 py-4 text-zinc-500">
                      {category.createdAt.toLocaleDateString()}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-4">
                        <Link
                          href={`/admin/categories/${category.id}/edit`}
                          className="text-sm font-semibold text-violet-700 transition-colors hover:text-violet-900"
                        >
                          Edit
                        </Link>

                        <CategoryDeleteButton categoryId={category.id} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-sm text-zinc-500"
                  >
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4 border-t border-zinc-200 pt-8">
        <div>
          <h2 className="text-lg font-semibold text-zinc-950">
            Create Category
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Add a new category to organize your products.
          </p>
        </div>

        <div className="w-full max-w-xl">
          <CategoryForm />
        </div>
      </section>
    </main>
  );
};

export default CategoriesPage;
