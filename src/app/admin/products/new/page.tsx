import UploadProductForm from "@/features/admin/components/upload-product-form";
import { db } from "@/lib/prisma";
import Link from "next/link";

const NewProductPage = async () => {
  const categories = await db.categorie.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-6 py-10 sm:px-8">
      <header className="flex flex-col gap-4 border-b border-zinc-200 pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
            Product Management
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
            Create Product
          </h1>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Add a new product to your store catalog.
          </p>
        </div>

        <Link
          href="/admin/products"
          className="w-fit text-sm font-semibold text-violet-700 transition-colors hover:text-violet-900"
        >
          Back to Products
        </Link>
      </header>

      <section className="border border-zinc-200 bg-white p-5 sm:p-8">
        <UploadProductForm categories={categories} />
      </section>
    </main>
  );
};

export default NewProductPage;
