"use client";
import { useState } from "react";
interface InventoryAdjustmentFormProps {
  productId: string;
  currentStock: number;
}
import { adjustInventory } from "@/features/admin/actions/adjust-inventory";
import { useRouter } from "next/navigation";
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
    <div className="space-y-3">
      <p>Current stock: {currentStock}</p>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setType("ADD")}
          className={`rounded-md px-4 py-2 ${
            type === "ADD" ? "bg-green-600 text-white" : "bg-gray-200"
          }`}
        >
          Add Stock
        </button>

        <button
          type="button"
          onClick={() => setType("REMOVE")}
          className={`rounded-md px-4 py-2 ${
            type === "REMOVE" ? "bg-red-600 text-white" : "bg-gray-200"
          }`}
        >
          Remove Stock
        </button>
      </div>

      <input
        type="number"
        min={1}
        step={1}
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="w-24 rounded-md border p-2"
      />
      <button
        type="button"
        onClick={handleAdjustStock}
        disabled={isPending || quantity < 1 || !Number.isInteger(quantity)}
        className="rounded-md bg-indigo-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {isPending ? "Updating..." : "Update Stock"}
      </button>
      {message && <p>{message}</p>}

      <p>
        Action: {type} {quantity} units
      </p>
    </div>
  );
};

export default InventoryAdjustmentForm;
