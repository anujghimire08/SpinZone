import { db } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductForm from "@/features/admin/components/ProductForm";

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

const EditProductPage = async ({ params }: EditProductPageProps) => {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    db.product.findUnique({
      where: { id },
    }),
    db.categorie.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  if (!product) {
    notFound();
  }

  const initialData = {
    name: product.name,
    description: product.description ?? "",
    category_id: product.category_id,
    price: Number(product.price),
    slug: product.slug,
    img: product.img,
    discount_percent:
      product.discount_percent === null
        ? undefined
        : Number(product.discount_percent),
    brand: product.brand,
    isActive: product.isActive,
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Edit Product</h1>

      <ProductForm
        categories={categories}
        initialData={initialData}
        productId={product.id}
      />
    </main>
  );
};

export default EditProductPage;
