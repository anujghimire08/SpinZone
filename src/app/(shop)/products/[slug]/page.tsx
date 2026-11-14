import Link from "next/link";
import { notFound } from "next/navigation";

import ProductDetails from "@/features/storefront/components/product-details";
import { getStorefrontProductBySlug } from "@/features/storefront/queries/get-storefront-product-by-slug";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { slug } = await params;

  const product = await getStorefrontProductBySlug(slug);

  if (!product) notFound();

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-10">
      <nav
        aria-label="Breadcrumb"
        className="mb-8 flex items-center gap-2 text-sm text-zinc-400"
      >
        <Link href="/products" className="transition hover:text-violet-400">
          Products
        </Link>

        <span>/</span>

        <span className="text-zinc-200">{product.name}</span>
      </nav>

      <ProductDetails product={product} />
    </main>
  );
};

export default ProductPage;
