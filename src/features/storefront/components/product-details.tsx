import Image from "@/features/admin/components/Image";
import { getStorefrontProductBySlug } from "@/features/storefront/queries/get-storefront-product-by-slug";
import ProductPurchaseControls from "./product-purchase-controls";

type ProductDetailsProps = {
  product: NonNullable<Awaited<ReturnType<typeof getStorefrontProductBySlug>>>;
};

const ProductDetails = ({ product }: ProductDetailsProps) => {
  const price = Number(product.price);
  const discount = Number(product.discount_percent ?? 0);
  const discountedPrice = price - (price * discount) / 100;

  const isInStock = (product.inventory?.quantity ?? 0) > 0;

  return (
    <section className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-zinc-900">
        <Image
          src={product.img}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain p-8"
        />
      </div>

      <div className="flex flex-col">
        <p className="text-sm font-semibold uppercase tracking-wider text-violet-400">
          {product.categorie.name}
        </p>
        <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
          {product.name}
        </h1>
        <p className="mt-3 text-sm text-zinc-400">
          Brand:
          <span className="font-medium text-zinc-200">{product.brand}</span>
        </p>
        <div className="mt-8 border-y border-white/10 py-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-3xl font-bold text-white">
              Rs. {discountedPrice.toFixed(2)}
            </span>

            {discount > 0 && (
              <>
                <span className="text-lg text-zinc-500 line-through">
                  Rs. {price.toFixed(2)}
                </span>

                <span className="rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold text-white">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>
        </div>
        <div className="mt-6 flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              isInStock ? "bg-emerald-500" : "bg-red-500"
            }`}
          />

          <p
            className={`text-sm font-medium ${
              isInStock ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {isInStock
              ? `In Stock (${product.inventory?.quantity} available)`
              : "Out of Stock"}
          </p>
        </div>

        <ProductPurchaseControls
          productId={product.id}
          stock={product.inventory?.quantity ?? 0}
        />
        {product.description && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-white">
              Product Description
            </h2>

            <p className="mt-3 text-sm leading-7 text-zinc-400">
              {product.description}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductDetails;
