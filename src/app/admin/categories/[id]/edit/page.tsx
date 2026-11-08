import { getCategoryById } from "@/features/admin/queries/get-categories";
import CategoryForm from "@/features/admin/components/category-form";
import { notFound } from "next/navigation";
import Link from "next/link";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

const EditCategoryPage = async ({ params }: Props) => {
  const { id } = await params;

  const category = await getCategoryById(id);

  if (!category) {
    notFound();
  }

  return (
    <main className="space-y-6 p-6">
      <div>
        <Link
          href="/admin/categories"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back to Categories
        </Link>

        <h1 className="mt-3 text-2xl font-bold">Edit Category</h1>
        <p className="mt-1 text-sm text-gray-500">
          Update the category name and its slug.
        </p>
      </div>

      <div className="max-w-xl">
        <CategoryForm category={category} />
      </div>
    </main>
  );
};

export default EditCategoryPage;
