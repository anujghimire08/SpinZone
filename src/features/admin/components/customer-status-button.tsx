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
      const result = await updateCustomerStatus({
        customerId,
        isActive: nextStatus,
      });

      if (!result.success) {
        window.alert(result.error);
        return;
      }

      router.refresh();
    });
  };

  return (
    <button
      type="button"
      onClick={handleStatusChange}
      disabled={isPending}
      className="rounded-md border px-4 py-2 disabled:opacity-50"
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
