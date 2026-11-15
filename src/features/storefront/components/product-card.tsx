import Link from "next/link";
import { Prisma } from "@/generated/prisma/client";
import Image from "@/features/admin/components/Image";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    img: string;
    price: Prisma.Decimal;
    discount_percent: Prisma.Decimal | null;
    categorie: {
      name: string;
    };
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const price = Number(product.price);
  const discount = Number(product.discount_percent ?? 0);
  const discountedPrice = price - (price * discount) / 100;

  return (
    <Link href={`/products/${product.slug}`} className="group block min-w-0">
      <div className="relative aspect-square overflow-hidden bg-[#f3f3f1]">
        <Image
          src={product.img}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-5 transition-transform duration-500 ease-out group-hover:scale-[1.06] sm:p-7"
        />

        {discount > 0 && (
          <span className="absolute left-3 top-3 bg-violet-700 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            {discount}% off
          </span>
        )}

        <span
          aria-hidden="true"
          className="absolute bottom-3 right-3 flex h-9 w-9 translate-y-2 items-center justify-center bg-white text-lg text-zinc-900 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
        >
          ↗
        </span>
      </div>

      <div className="pt-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-violet-700">
          {product.categorie.name}
        </p>

        <h3 className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-zinc-900 transition-colors group-hover:text-violet-700 sm:text-[15px]">
          {product.name}
        </h3>

        <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-sm font-bold tabular-nums text-zinc-950 sm:text-base">
            Rs. {discountedPrice.toFixed(2)}
          </span>

          {discount > 0 && (
            <span className="text-xs tabular-nums text-zinc-400 line-through sm:text-sm">
              Rs. {price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
