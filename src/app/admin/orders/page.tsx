import OrderFilters from "@/features/admin/components/order-filters";
import { getOrders } from "@/features/admin/queries/get-orders";

import { DeliveryStatus } from "@/generated/prisma/client";
import Link from "next/link";

interface ParamsPropsType {
  searchParams: Promise<{
    status: DeliveryStatus;
    search: string;
    page: string;
  }>;
}

const OrdersPage = async ({ searchParams }: ParamsPropsType) => {
  const params = await searchParams;
  const status = params.status;
  const search = params.status || undefined;
  const currentPage = params.page ? Number(params.page) : undefined;
  const results = await getOrders({ status, search, currentPage });

  const createPageUrl = (page: number) => {
    const query = new URLSearchParams();
    if (search) query.set("search", search);
    if (status) query.set("status", status);
    if (page) query.set("page", String(page));

    return `/admin/orders?${query.toString()}`;
  };

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-sm text-gray-500">
          Manage and track customer orders.
        </p>
      </div>

      <OrderFilters search={search} status={status} />

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Items</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {results.orders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="p-3 font-medium">
                  {order.id.slice(-8).toUpperCase()}
                </td>

                <td className="p-3">
                  <div>{order.customer?.user.name ?? "Guest"}</div>
                  <div className="text-xs text-gray-500">
                    {order.customer?.user.email ?? "No customer email"}
                  </div>
                </td>

                <td className="p-3">{order._count.order_item}</td>

                <td className="p-3">
                  Rs. {Number(order.total_price).toFixed(2)}
                </td>

                <td className="p-3">{order.status}</td>

                <td className="p-3">{order.createdAt.toLocaleDateString()}</td>
                <td className="p-3">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}

            {results.orders.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {results.orders.length} of {results.totalData} records
          </p>

          <div className="flex gap-2">
            <Link
              href={createPageUrl(results.page - 1)}
              aria-disabled={results.page <= 1}
              className={`rounded-md border px-4 py-2 ${
                results.page <= 1 ? "pointer-events-none opacity-50" : ""
              }`}
            >
              Previous
            </Link>

            <span className="px-3 py-2 text-sm">
              Page {results.page} of {Math.max(results.totalPages, 1)}
            </span>

            <Link
              href={createPageUrl(results.page + 1)}
              aria-disabled={
                results.page >= results.totalPages || results.totalData === 0
              }
              className={`rounded-md border px-4 py-2 ${
                results.page >= results.totalPages || results.totalData === 0
                  ? "pointer-events-none opacity-50"
                  : ""
              }`}
            >
              Next
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrdersPage;
