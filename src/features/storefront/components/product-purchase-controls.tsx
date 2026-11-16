"use client";

import { useState } from "react";
import { addToCart } from "@/features/cart/action/add-to-cart";
import { useRouter } from "next/navigation";

interface ProductPurchaseControlsProps {
  productId: string;
  stock: number;
}

const ProductPurchaseControls = ({
  productId,
  stock,
}: ProductPurchaseControlsProps) => {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isPending, setIsPending] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string | undefined;
  } | null>(null);

  const maxQuantity = Math.min(stock, 100);

  const handleAddToCart = async () => {
    setIsPending(true);
    setFeedback(null);

    try {
      const result = await addToCart({
        productId,
        quantity,
      });

      if (!result.success) {
        if (result.error === "UNAUTHENTICATED") {
          const callbackUrl = window.location.pathname;

          window.location.href = `/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`;
          return;
        }

        setFeedback({
          type: "error",
          message: result.error,
        });

        return;
      }
      router.refresh();
      setFeedback({
        type: "success",
        message: result.message,
      });
    } catch {
      setFeedback({
        type: "error",
        message: "Unable to add product to cart. Please try again.",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="mt-8 space-y-5">
      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-zinc-700">
          Quantity
        </p>

        <div className="flex w-fit items-center border border-zinc-300 bg-white">
          <button
            type="button"
            disabled={quantity <= 1 || stock <= 0}
            onClick={() => setQuantity((prev) => prev - 1)}
            className="flex h-11 w-11 items-center justify-center text-lg text-zinc-700 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Decrease quantity"
          >
            −
          </button>

          <span className="min-w-12 text-center text-sm font-semibold tabular-nums text-zinc-950">
            {quantity}
          </span>

          <button
            type="button"
            disabled={quantity >= maxQuantity}
            onClick={() => setQuantity((prev) => prev + 1)}
            className="flex h-11 w-11 items-center justify-center text-lg text-zinc-700 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <button
        type="button"
        disabled={stock <= 0 || isPending}
        onClick={handleAddToCart}
        className="flex h-13 w-full items-center justify-center gap-3 bg-violet-700 px-6 text-sm font-bold text-white transition-colors hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {stock <= 0
          ? "Out of Stock"
          : isPending
            ? "Adding to cart..."
            : "Add to Cart"}
      </button>

      {feedback && (
        <p
          role="status"
          aria-live="polite"
          className={`text-sm ${
            feedback.type === "success" ? "text-emerald-700" : "text-red-700"
          }`}
        >
          {feedback.message}
        </p>
      )}
    </div>
  );
};

export default ProductPurchaseControls;
