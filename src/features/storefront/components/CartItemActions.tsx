"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, Settings2, X } from "lucide-react";
import { removeCart } from "@/features/cart/action/remove-cart-items";

interface CartItemActionsProps {
  cart_id: string;
  productId: string;
  productName: string;
  quantity: number;
  availableStock: number;
}

const CartItemActions = ({
  cart_id,
  productId,
  productName,
  quantity,
  availableStock,
}: CartItemActionsProps) => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(quantity);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleOpen = () => {
    setSelectedQuantity(quantity);
    setError("");
    setIsOpen(true);
  };

  const handleClose = () => {
    if (isPending) return;
    setIsOpen(false);
  };

  const handleUpdate = () => {
    const difference = selectedQuantity - quantity;

    if (difference === 0) {
      setIsOpen(false);
      return;
    }

    setError("");

    startTransition(async () => {
      const result = await removeCart({
        cart_id,
        product_id: productId,
        quantity: Math.abs(difference),
        action: difference > 0 ? "ADD" : "SUB",
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      setIsOpen(false);
      router.refresh();
    });
  };

  const handleDelete = () => {
    setError("");

    startTransition(async () => {
      const result = await removeCart({
        cart_id,
        product_id: productId,
        action: "All",
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      setIsOpen(false);
      router.refresh();
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="inline-flex items-center gap-2 border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 transition-colors hover:border-violet-700 hover:text-violet-700"
      >
        <Settings2 size={15} />
        Options
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4"
          onClick={handleClose}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-item-modal-title"
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md border border-zinc-200 bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-zinc-200 pb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
                  Cart options
                </p>

                <h2
                  id="cart-item-modal-title"
                  className="mt-2 text-xl font-semibold tracking-tight text-zinc-950"
                >
                  Manage item
                </h2>

                <p className="mt-1 text-sm text-zinc-500">{productName}</p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                disabled={isPending}
                aria-label="Close modal"
                className="text-zinc-400 transition-colors hover:text-zinc-950 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-zinc-800">
                  Quantity
                </span>

                <span className="text-xs text-zinc-500">
                  {availableStock} available
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between border border-zinc-200 p-2">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedQuantity((current) => Math.max(1, current - 1))
                  }
                  disabled={selectedQuantity <= 1 || isPending}
                  aria-label="Decrease quantity"
                  className="flex h-10 w-10 items-center justify-center bg-zinc-100 text-zinc-700 transition-colors hover:bg-violet-100 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Minus size={16} />
                </button>

                <span className="text-lg font-semibold tabular-nums text-zinc-950">
                  {selectedQuantity}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedQuantity((current) =>
                      Math.min(availableStock, current + 1),
                    )
                  }
                  disabled={selectedQuantity >= availableStock || isPending}
                  aria-label="Increase quantity"
                  className="flex h-10 w-10 items-center justify-center bg-zinc-100 text-zinc-700 transition-colors hover:bg-violet-100 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Plus size={16} />
                </button>
              </div>

              {selectedQuantity > availableStock && (
                <p className="mt-2 text-xs text-red-600">
                  The selected quantity exceeds available stock.
                </p>
              )}
            </div>

            {error && (
              <div className="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="mt-7 flex flex-col gap-3">
              <button
                type="button"
                onClick={handleUpdate}
                disabled={
                  isPending ||
                  selectedQuantity === quantity ||
                  selectedQuantity < 1 ||
                  selectedQuantity > availableStock
                }
                className="w-full bg-violet-700 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? "Please wait..." : "Update quantity"}
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="inline-flex w-full items-center justify-center gap-2 border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 size={16} />
                Remove item
              </button>

              <button
                type="button"
                onClick={handleClose}
                disabled={isPending}
                className="w-full px-4 py-2 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-950 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartItemActions;
