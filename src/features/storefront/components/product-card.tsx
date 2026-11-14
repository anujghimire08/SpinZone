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
    <Link
      href={`/products/${product.slug}`}
      className="group overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 transition hover:-translate-y-1 hover:border-violet-500/40"
    >
      <div className="relative aspect-square overflow-hidden bg-zinc-800">
        <Image
          src={product.img}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-5 transition duration-500 group-hover:scale-105"
        />

        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold text-white">
            {discount}% OFF
          </span>
        )}
      </div>

      <div className="p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-violet-400">
          {product.categorie.name}
        </p>

        <h3 className="mt-2 line-clamp-2 font-semibold text-white">
          {product.name}
        </h3>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-lg font-bold text-white">
            Rs. {discountedPrice.toFixed(2)}
          </span>

          {discount > 0 && (
            <span className="text-sm text-zinc-500 line-through">
              Rs. {price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
