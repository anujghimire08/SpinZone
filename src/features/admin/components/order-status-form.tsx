"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { DeliveryStatus } from "@/generated/prisma/client";
import {
  confirmOrder,
  updateOrderStatus,
} from "@/features/admin/actions/order";

interface OrderStatusFormProps {
  orderId: string;
  currentStatus: DeliveryStatus;
}

const OrderStatusForm = ({ orderId, currentStatus }: OrderStatusFormProps) => {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    setError("");

    startTransition(async () => {
      const result =
        status === "CONFIRMED"
          ? await confirmOrder(orderId)
          : await updateOrderStatus({ orderId, status });

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.refresh();
    });
  };

  return (
    <section className="space-y-4 rounded-lg border p-5">
      <h2 className="text-lg font-semibold">Update Order Status</h2>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as DeliveryStatus)}
          disabled={isPending}
          className="rounded-md border px-3 py-2"
        >
          {[
            "PENDING",
            "CONFIRMED",
            "PROCESSING",
            "SHIPPED",
            "OUT_FOR_DELIVERY",
            "DELIVERED",
            "CANCELLED",
            "RETURNED",
          ].map((item) => (
            <option key={item} value={item}>
              {item.replaceAll("_", " ")}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending || status === currentStatus}
          className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {isPending ? "Updating..." : "Update Status"}
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </section>
  );
};

export default OrderStatusForm;
