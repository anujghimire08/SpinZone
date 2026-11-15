"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adjustInventory } from "@/features/admin/actions/adjust-inventory";

interface InventoryAdjustmentFormProps {
  productId: string;
  currentStock: number;
}

const InventoryAdjustmentForm = ({
  productId,
  currentStock,
}: InventoryAdjustmentFormProps) => {
  const router = useRouter();

  const [type, setType] = useState<"ADD" | "REMOVE">("ADD");
  const [quantity, setQuantity] = useState<number>(1);
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<string | undefined>("");

  const handleAdjustStock = async () => {
    setIsPending(true);
    setMessage("");

    try {
      const result = await adjustInventory({
        productId,
        type,
        quantity,
      });

      if (!result.success) {
        setMessage(result.error);
        return;
      }

      setMessage(result.message);
      setQuantity(1);
      router.refresh();
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="w-full space-y-3 sm:w-auto sm:min-w-[320px]">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          Stock Adjustment
        </p>
        <p className="text-sm text-zinc-500">
          Current:{" "}
          <span className="font-semibold tabular-nums text-zinc-950">
            {currentStock}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => {
            setType("ADD");
            setMessage("");
          }}
          disabled={isPending}
          aria-pressed={type === "ADD"}
          className={`cursor-pointer border px-3 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
            type === "ADD"
              ? "border-green-700 bg-green-700 text-white"
              : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50"
          }`}
        >
          Add Stock
        </button>

        <button
          type="button"
          onClick={() => {
            setType("REMOVE");
            setMessage("");
          }}
          disabled={isPending}
          aria-pressed={type === "REMOVE"}
          className={`cursor-pointer border px-3 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
            type === "REMOVE"
              ? "border-red-600 bg-red-600 text-white"
              : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50"
          }`}
        >
          Remove Stock
        </button>
      </div>

      <div className="flex gap-2">
        <input
          type="number"
          min={1}
          step={1}
          value={quantity}
          onChange={(e) => {
            setQuantity(e.target.value === "" ? 0 : Number(e.target.value));
            setMessage("");
          }}
          disabled={isPending}
          aria-label="Adjustment quantity"
          className="w-full min-w-0 border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-950 outline-none transition focus:border-violet-700 focus:ring-2 focus:ring-violet-700/10 disabled:cursor-not-allowed disabled:bg-zinc-50"
        />

        <button
          type="button"
          onClick={handleAdjustStock}
          disabled={isPending || quantity < 1 || !Number.isInteger(quantity)}
          className="shrink-0 cursor-pointer bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Updating..." : "Update Stock"}
        </button>
      </div>

      {message && (
        <p
          role="status"
          aria-live="polite"
          className={`border px-3 py-2 text-xs leading-5 ${
            message.toLowerCase().includes("success")
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message}
        </p>
      )}

      <p className="text-xs text-zinc-500">
        Action:{" "}
        <span
          className={`font-semibold ${
            type === "ADD" ? "text-green-700" : "text-red-700"
          }`}
        >
          {type === "ADD" ? "Add" : "Remove"} {quantity}{" "}
          {quantity === 1 ? "unit" : "units"}
        </span>
      </p>
    </div>
  );
};

export default InventoryAdjustmentForm;
