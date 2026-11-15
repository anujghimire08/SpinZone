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

const ORDER_STATUSES: DeliveryStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
];

const OrderStatusForm = ({ orderId, currentStatus }: OrderStatusFormProps) => {
  const router = useRouter();

  const [status, setStatus] = useState<DeliveryStatus>(currentStatus);
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    setError("");

    startTransition(async () => {
      try {
        const result =
          status === "CONFIRMED"
            ? await confirmOrder(orderId)
            : await updateOrderStatus({ orderId, status });

        if (!result.success) {
          setError(result.error);
          return;
        }

        router.refresh();
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <section className="space-y-5 border border-zinc-200 bg-white p-5 sm:p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
          Order Management
        </p>

        <h2 className="mt-2 text-lg font-semibold text-zinc-950">
          Update Order Status
        </h2>

        <p className="mt-1 text-sm text-zinc-500">
          Change the current delivery status of this order.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="w-full space-y-2 sm:max-w-xs">
          <label
            htmlFor="order-status"
            className="block text-sm font-medium text-zinc-700"
          >
            Select Status
          </label>

          <select
            id="order-status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as DeliveryStatus);
              setError("");
            }}
            disabled={isPending}
            className="w-full border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-violet-700 focus:ring-2 focus:ring-violet-700/10 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:opacity-60"
          >
            {ORDER_STATUSES.map((item) => (
              <option key={item} value={item}>
                {item.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending || status === currentStatus}
          className="w-full cursor-pointer bg-violet-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isPending ? "Updating..." : "Update Status"}
        </button>
      </div>

      {error && (
        <p
          role="alert"
          className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}
    </section>
  );
};

export default OrderStatusForm;
