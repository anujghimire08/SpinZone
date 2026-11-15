import { DeliveryStatus } from "@/generated/prisma/client";
import Link from "next/link";

interface OrderFiltersPropsType {
  search?: string;
  status?: DeliveryStatus;
}

const OrderFilters = ({ search, status }: OrderFiltersPropsType) => {
  return (
    <form
      method="GET"
      key={`${search ?? ""}-${status ?? "ALL"}`}
      className="flex flex-col gap-3 border border-zinc-200 bg-white p-4 sm:flex-row sm:flex-wrap sm:items-center"
    >
      <input
        type="search"
        name="search"
        placeholder="Search order ID, customer..."
        defaultValue={search ?? ""}
        className="w-full border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-950 placeholder:text-zinc-400 outline-none transition focus:border-violet-700 focus:ring-2 focus:ring-violet-700/10 sm:min-w-64 sm:flex-1"
      />

      <select
        name="status"
        defaultValue={status ?? ""}
        className="w-full border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-700 outline-none transition focus:border-violet-700 focus:ring-2 focus:ring-violet-700/10 sm:w-52"
      >
        <option value="">All Statuses</option>

        {Object.values(DeliveryStatus).map((item) => (
          <option key={item} value={item}>
            {item.replaceAll("_", " ")}
          </option>
        ))}
      </select>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 cursor-pointer bg-violet-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 sm:flex-none"
        >
          Filter
        </button>

        <Link
          href="/admin/orders"
          className="flex flex-1 items-center justify-center border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 sm:flex-none"
        >
          Reset
        </Link>
      </div>
    </form>
  );
};

export default OrderFilters;
