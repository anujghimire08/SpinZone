"use client";

import { updateCustomerStatus } from "@/features/admin/actions/customer";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface CustomerStatusButtonProps {
  customerId: string;
  isActive: boolean;
}

const CustomerStatusButton = ({
  customerId,
  isActive,
}: CustomerStatusButtonProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = () => {
    const nextStatus = !isActive;

    const confirmed = window.confirm(
      `Are you sure you want to ${nextStatus ? "activate" : "deactivate"} this customer?`,
    );

    if (!confirmed) return;

    startTransition(async () => {
      try {
        const result = await updateCustomerStatus({
          customerId,
          isActive: nextStatus,
        });

        if (!result.success) {
          window.alert(result.error);
          return;
        }

        router.refresh();
      } catch {
        window.alert("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleStatusChange}
      disabled={isPending}
      className={`w-full cursor-pointer px-4 py-3 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto ${
        isActive
          ? "border border-red-200 bg-white text-red-700 hover:bg-red-50 focus:ring-red-600"
          : "bg-violet-700 text-white hover:bg-violet-800 focus:ring-violet-700"
      }`}
    >
      {isPending
        ? "Updating..."
        : isActive
          ? "Deactivate Customer"
          : "Activate Customer"}
    </button>
  );
};

export default CustomerStatusButton;
