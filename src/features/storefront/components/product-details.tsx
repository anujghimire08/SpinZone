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
    <section className="mx-auto grid h-full max-w-7xl grid-cols-1 gap-5 md:grid-cols-2 md:gap-8">
      <div className="relative min-h-[220px] overflow-hidden bg-[#f0f0ed] md:min-h-0">
        <Image
          src={product.img}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain p-6 sm:p-8"
        />

        {discount > 0 && (
          <span className="absolute left-4 top-4 bg-violet-700 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white">
            {discount}% off
          </span>
        )}
      </div>

      <div className="flex min-h-0 flex-col justify-center overflow-y-auto py-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-700">
          {product.categorie.name}
        </p>

        <h1 className="mt-2 text-2xl font-bold leading-tight tracking-[-0.045em] text-zinc-950 sm:text-3xl lg:text-4xl">
          {product.name}
        </h1>

        <p className="mt-2 text-xs text-zinc-500">
          Brand:
          <span className="font-semibold text-zinc-800">{product.brand}</span>
        </p>

        <div className="mt-4 border-y border-zinc-200 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-2xl font-bold tabular-nums tracking-tight text-zinc-950">
              Rs. {discountedPrice.toFixed(2)}
            </span>

            {discount > 0 && (
              <>
                <span className="text-base tabular-nums text-zinc-400 line-through">
                  Rs. {price.toFixed(2)}
                </span>
                <span className="bg-violet-100 px-2.5 py-1 text-xs font-bold text-violet-800">
                  Save {discount}%
                </span>
              </>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full animate-pulse ${
              isInStock ? "bg-emerald-600" : "bg-red-600"
            }`}
          />

          <p
            className={`text-xs font-semibold ${
              isInStock ? "text-emerald-700" : "text-red-700"
            }`}
          >
            {isInStock
              ? `In Stock (${product.inventory?.quantity} available)`
              : "Out of Stock"}
          </p>
        </div>

        <div className="mt-4">
          <ProductPurchaseControls
            productId={product.id}
            stock={product.inventory?.quantity ?? 0}
          />
        </div>

        {product.description && (
          <div className="mt-5 border-t border-zinc-200 pt-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-zinc-900">
              Product description
            </h2>
            <p className="mt-2 text-xs leading-6 text-zinc-600">
              {product.description}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductDetails;
