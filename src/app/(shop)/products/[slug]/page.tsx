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
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-10 sm:px-8 lg:px-10">
      <nav
        aria-label="Breadcrumb"
        className="mb-8 flex flex-wrap items-center gap-2 text-sm"
      >
        <Link
          href="/products"
          className="font-medium text-zinc-500 transition-colors hover:text-violet-700"
        >
          Products
        </Link>

        <span className="text-zinc-300">/</span>

        <span
          aria-current="page"
          className="max-w-[240px] truncate font-medium text-zinc-950"
        >
          {product.name}
        </span>
      </nav>

      <ProductDetails product={product} />
    </main>
  );
};

export default ProductPage;
