import { DeliveryStatus } from "@/generated/prisma/client";
import Link from "next/link";

interface OrderFiltersPropsType {
  search?: string;
  status?: DeliveryStatus;
}

const OrderFilters = ({ search, status }: OrderFiltersPropsType) => {
  return (
    <form
      className="flex flex-wrap items-center gap-3"
      method="GET"
      key={`${search}, ${status}`}
    >
      <input
        type="text"
        name="search"
        placeholder="Search order ID, customer..."
        defaultValue={search}
        className="rounded-md border px-3 py-2"
      />

      <select
        name="status"
        defaultValue={status ?? ""}
        className="rounded-md border px-3 py-2"
      >
        <option value="">All status</option>
        {Object.values(DeliveryStatus).map((item) => (
          <option key={item} value={item}>
            {item.replaceAll("_", " ")}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="rounded-md bg-black px-4 py-2 text-white"
      >
        Filter
      </button>
      <Link
        href="/admin/orders"
        className="rounded-md bg-black px-4 py-2 text-white"
      >
        Reset
      </Link>
    </form>
  );
};

export default OrderFilters;
