import ProductForm from "@/features/admin/components/ProductForm";
import { db } from "@/lib/prisma";

const NewProductPage = async () => {
  const categories = await db.categorie.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Create Product</h1>

      <ProductForm categories={categories} />
    </main>
  );
};

export default NewProductPage;
