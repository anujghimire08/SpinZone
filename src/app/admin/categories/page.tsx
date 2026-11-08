import CategoryDeleteButton from "@/features/admin/components/category-delete-button";
import CategoryForm from "@/features/admin/components/category-form";
import { getCategories } from "@/features/admin/queries/get-categories";
import Link from "next/link";

const CategoriesPage = async () => {
  const categories = await getCategories();

  return (
    <main className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-sm text-gray-500">
            Manage your product categories.
          </p>
        </div>

        <p>Total categories: {categories.length}</p>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Products</th>
              <th className="p-3">Created At</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.length > 0 ? (
              categories.map((category) => (
                <tr key={category.id} className="border-t">
                  <td className="p-3 font-medium">{category.name}</td>
                  <td className="p-3">{category.slug}</td>
                  <td className="p-3">{category._count.product}</td>
                  <td className="p-3">
                    {category.createdAt.toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <span className="text-gray-500">
                      <td className="flex items-center gap-4">
                        <Link
                          href={`/admin/categories/${category.id}/edit`}
                          className="text-sm font-medium text-blue-600 hover:underline"
                        >
                          Edit
                        </Link>

                        <CategoryDeleteButton categoryId={category.id} />
                      </td>
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-6 text-center">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold">Create Category</h2>
          <CategoryForm />
        </section>
      </div>
    </main>
  );
};

export default CategoriesPage;
