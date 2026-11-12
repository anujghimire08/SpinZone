import UploadProductForm from "@/features/admin/components/upload-product-form";
import { db } from "@/lib/prisma";

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
    <main className="p-6">
      <h1 className="text-2xl font-bold">Create Product</h1>

      <UploadProductForm categories={categories} />
    </main>
  );
};

export default NewProductPage;
