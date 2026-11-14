import { notFound } from "next/navigation";
import ProductDetails from "@/features/storefront/components/product-details";
import { getStorefrontProductBySlug } from "@/features/storefront/queries/get-storefront-product-by-slug";
import ProductDetailsModal from "@/features/storefront/components/product-details-modal";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { slug } = await params;

  const product = await getStorefrontProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-12">
      <ProductDetailsModal>
        <ProductDetails product={product} />
      </ProductDetailsModal>
    </main>
  );
};

export default ProductPage;
