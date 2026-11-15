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
    <main className="mx-auto w-full max-w-7xl space-y-8 px-6 py-10 sm:px-8">
      <div className="space-y-3 border-b border-zinc-200 pb-6">
        <Link
          href="/admin/categories"
          className="inline-flex text-sm font-medium text-zinc-500 transition-colors hover:text-violet-700"
        >
          Back to Categories
        </Link>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
            Category Management
          </p>

          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
            Edit Category
          </h1>

          <p className="text-sm leading-6 text-zinc-500">
            Update the category name and its slug.
          </p>
        </div>
      </div>

      <section className="w-full max-w-xl">
        <CategoryForm category={category} />
      </section>
    </main>
  );
};

export default EditCategoryPage;
