"use client";

import { useState } from "react";
import { addToCart } from "@/features/cart/action/add-to-cart";

interface ProductPurchaseControlsProps {
  productId: string;
  stock: number;
}

const ProductPurchaseControls = ({
  productId,
  stock,
}: ProductPurchaseControlsProps) => {
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
          // handle login redirect
        }

        setFeedback({
          type: "error",
          message: result.error,
        });

        return;
      }

      setFeedback({
        type: "success",
        message: result.message,
      });
      return;
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
        <p className="mb-3 text-sm font-medium text-zinc-300">Quantity</p>

        <div className="flex w-fit items-center overflow-hidden rounded-lg border border-white/10">
          <button
            type="button"
            disabled={quantity <= 1 || stock <= 0}
            onClick={() => setQuantity((prev) => prev - 1)}
            className="px-4 py-2 text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Decrease quantity"
          >
            −
          </button>

          <span className="min-w-12 text-center text-sm text-white">
            {quantity}
          </span>

          <button
            type="button"
            disabled={quantity >= maxQuantity}
            onClick={() => setQuantity((prev) => prev + 1)}
            className="px-4 py-2 text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
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
        className="w-full rounded-lg bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {stock <= 0 ? "Out of Stock" : isPending ? "Adding..." : "Add to Cart"}
      </button>

      {feedback && (
        <p
          role="status"
          aria-live="polite"
          className={`text-sm ${
            feedback.type === "success" ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {feedback.message}
        </p>
      )}
    </div>
  );
};

export default ProductPurchaseControls;
