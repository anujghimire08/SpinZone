import OrderFilters from "@/features/admin/components/order-filters";
import { getOrders } from "@/features/admin/queries/get-orders";
import { DeliveryStatus } from "@/generated/prisma/client";
import Link from "next/link";

interface ParamsPropsType {
  searchParams: Promise<{
    status?: DeliveryStatus;
    search?: string;
    page?: string;
  }>;
}

const OrdersPage = async ({ searchParams }: ParamsPropsType) => {
  const params = await searchParams;

  const status = params.status;
  const search = params.search?.trim() || undefined;
  const currentPage = params.page
    ? Math.max(1, Number(params.page) || 1)
    : undefined;

  const results = await getOrders({ status, search, currentPage });

  const createPageUrl = (page: number) => {
    const query = new URLSearchParams();

    if (search) query.set("search", search);
    if (status) query.set("status", status);
    if (page > 1) query.set("page", String(page));

    return `/admin/orders?${query.toString()}`;
  };

  const isPreviousDisabled = results.page <= 1;
  const isNextDisabled =
    results.page >= results.totalPages || results.totalData === 0;

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-6 py-10 sm:px-8">
      <div className="border-b border-zinc-200 pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
          Order Management
        </p>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
          Orders
        </h1>

        <p className="mt-2 text-sm leading-6 text-zinc-500">
          Manage and track customer orders.
        </p>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-950">Filter Orders</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Search orders or filter by delivery status.
          </p>
        </div>

        <OrderFilters search={search} status={status} />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-950">All Orders</h2>
          <p className="mt-1 text-sm text-zinc-500">
            View customer orders, payment totals, and delivery progress.
          </p>
        </div>

        <div className="overflow-x-auto border border-zinc-200 bg-white">
          <table className="w-full min-w-225 text-left text-sm">
            <thead className="bg-zinc-50">
              <tr className="border-b border-zinc-200">
                <th className="px-5 py-4 font-semibold text-zinc-600">
                  Order ID
                </th>
                <th className="px-5 py-4 font-semibold text-zinc-600">
                  Customer
                </th>
                <th className="px-5 py-4 font-semibold text-zinc-600">Items</th>
                <th className="px-5 py-4 font-semibold text-zinc-600">Total</th>
                <th className="px-5 py-4 font-semibold text-zinc-600">
                  Status
                </th>
                <th className="px-5 py-4 font-semibold text-zinc-600">Date</th>
                <th className="px-5 py-4 font-semibold text-zinc-600">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-200">
              {results.orders.map((order) => (
                <tr
                  key={order.id}
                  className="transition-colors hover:bg-zinc-50"
                >
                  <td className="px-5 py-4 font-semibold tabular-nums text-zinc-950">
                    {order.id.slice(-8).toUpperCase()}
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-semibold text-zinc-950">
                      {order.customer?.user.name ?? "Guest"}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {order.customer?.user.email ?? "No customer email"}
                    </p>
                  </td>

                  <td className="px-5 py-4 tabular-nums text-zinc-700">
                    {order._count.order_item}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap font-medium tabular-nums text-zinc-950">
                    Rs. {Number(order.total_price).toFixed(2)}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex border px-2.5 py-1 text-xs font-semibold ${
                        order.status === "DELIVERED"
                          ? "border-green-200 bg-green-50 text-green-700"
                          : order.status === "CANCELLED" ||
                              order.status === "RETURNED"
                            ? "border-red-200 bg-red-50 text-red-700"
                            : order.status === "PENDING"
                              ? "border-amber-200 bg-amber-50 text-amber-700"
                              : "border-violet-200 bg-violet-50 text-violet-700"
                      }`}
                    >
                      {order.status.replaceAll("_", " ")}
                    </span>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-zinc-500">
                    {order.createdAt.toLocaleDateString()}
                  </td>

                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-semibold text-violet-700 transition-colors hover:text-violet-900"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}

              {results.orders.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-sm text-zinc-500"
                  >
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex flex-col gap-4 border-t border-zinc-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-zinc-500">
              Showing{" "}
              <span className="font-semibold text-zinc-950">
                {results.orders.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-zinc-950">
                {results.totalData}
              </span>{" "}
              records
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={createPageUrl(results.page - 1)}
                aria-disabled={isPreviousDisabled}
                tabIndex={isPreviousDisabled ? -1 : undefined}
                className={`border px-4 py-2 text-sm font-medium transition-colors ${
                  isPreviousDisabled
                    ? "pointer-events-none border-zinc-200 text-zinc-400"
                    : "border-zinc-300 text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                Previous
              </Link>

              <span className="px-2 text-sm text-zinc-600">
                Page{" "}
                <span className="font-semibold text-zinc-950">
                  {results.page}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-zinc-950">
                  {Math.max(results.totalPages, 1)}
                </span>
              </span>

              <Link
                href={createPageUrl(results.page + 1)}
                aria-disabled={isNextDisabled}
                tabIndex={isNextDisabled ? -1 : undefined}
                className={`border px-4 py-2 text-sm font-medium transition-colors ${
                  isNextDisabled
                    ? "pointer-events-none border-zinc-200 text-zinc-400"
                    : "border-zinc-300 text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                Next
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default OrdersPage;
