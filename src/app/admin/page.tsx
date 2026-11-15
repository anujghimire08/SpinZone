import RevenueChart from "@/features/admin/components/revenue-chart";
import { getDashboardStats } from "@/features/admin/queries/get-dashboard-stats";
import { getMonthlyRevenue } from "@/features/admin/queries/get-monthly-revenue";
import Link from "next/link";

const AdminPage = async () => {
  const stats = await getDashboardStats();
  const monthlyRevenue = await getMonthlyRevenue();

  const statusStyles: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-700",
    CONFIRMED: "bg-violet-50 text-violet-700",
    PROCESSING: "bg-blue-50 text-blue-700",
    SHIPPED: "bg-indigo-50 text-indigo-700",
    OUT_FOR_DELIVERY: "bg-orange-50 text-orange-700",
    DELIVERED: "bg-green-50 text-green-700",
    CANCELLED: "bg-red-50 text-red-700",
    RETURNED: "bg-red-50 text-red-700",
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-zinc-200 pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
          Administration
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-500">
          Overview of your store performance, orders, inventory, and customers.
        </p>
      </div>

      <section className="space-y-5 border border-zinc-200 bg-white p-5 sm:p-6">
        <div>
          <h2 className="text-lg font-semibold text-zinc-950">
            Revenue Analytics
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Monthly revenue from delivered orders (last 6 months)
          </p>
        </div>

        <RevenueChart data={monthlyRevenue} />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-950">
            Store Overview
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Key performance indicators for your store.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              label: "Total Revenue",
              value: `Rs. ${stats.totalRevenue.toLocaleString("en-IN")}`,
            },
            {
              label: "Total Orders",
              value: stats.totalOrders,
            },
            {
              label: "Total Customers",
              value: stats.totalCustomers,
            },
            {
              label: "Total Products",
              value: stats.totalProducts,
            },
            {
              label: "Pending Orders",
              value: stats.pendingOrders,
            },
            {
              label: "Low Stock Products",
              value: stats.lowStockProducts,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="border border-zinc-200 bg-white p-5 transition-colors hover:border-violet-300"
            >
              <p className="text-sm font-medium text-zinc-500">{stat.label}</p>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-5 border border-zinc-200 bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-zinc-950">
              Order Status Overview
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Breakdown of all orders by delivery status.
            </p>
          </div>

          <Link
            href="/admin/orders"
            className="text-sm font-semibold text-violet-700 transition-colors hover:text-violet-900"
          >
            View All Orders
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "PENDING",
            "CONFIRMED",
            "PROCESSING",
            "SHIPPED",
            "OUT_FOR_DELIVERY",
            "DELIVERED",
            "CANCELLED",
            "RETURNED",
          ].map((status) => {
            const orderStatus = stats.ordersByStatus.find(
              (item) => item.status === status,
            );

            return (
              <div
                key={status}
                className="border border-zinc-200 bg-zinc-50 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  {status.replaceAll("_", " ")}
                </p>
                <p className="mt-2 text-2xl font-semibold text-zinc-950">
                  {orderStatus?._count._all ?? 0}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="overflow-hidden border border-zinc-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 p-5">
          <div>
            <h2 className="text-lg font-semibold text-zinc-950">
              Recent Orders
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Latest 5 customer orders
            </p>
          </div>

          <Link
            href="/admin/orders"
            className="text-sm font-semibold text-violet-700 transition-colors hover:text-violet-900"
          >
            View All Orders
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-187.5 text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Order ID</th>
                <th className="px-5 py-4 font-semibold">Customer</th>
                <th className="px-5 py-4 font-semibold">Items</th>
                <th className="px-5 py-4 font-semibold">Total</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-200">
              {stats.recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="transition-colors hover:bg-zinc-50"
                >
                  <td className="whitespace-nowrap px-5 py-4 font-medium text-zinc-900">
                    #{order.id.slice(-8)}
                  </td>

                  <td className="px-5 py-4 text-zinc-700">
                    {order.customer?.user.name ?? "Guest"}
                  </td>

                  <td className="px-5 py-4 text-zinc-600">
                    {order._count.order_item}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 font-medium text-zinc-900">
                    Rs. {Number(order.total_price).toLocaleString("en-IN")}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex whitespace-nowrap px-2.5 py-1 text-xs font-semibold ${
                        statusStyles[order.status] ??
                        "bg-zinc-100 text-zinc-700"
                      }`}
                    >
                      {order.status.replaceAll("_", " ")}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-zinc-500">
                    {order.createdAt.toLocaleDateString()}
                  </td>
                </tr>
              ))}

              {stats.recentOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-sm text-zinc-500"
                  >
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="overflow-hidden border border-zinc-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 p-5">
          <div>
            <h2 className="text-lg font-semibold text-zinc-950">
              Low Stock Products
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Products that need restocking (5 or fewer items)
            </p>
          </div>

          <Link
            href="/admin/inventory"
            className="text-sm font-semibold text-violet-700 transition-colors hover:text-violet-900"
          >
            View All Inventory
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-150 text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Product</th>
                <th className="px-5 py-4 font-semibold">Available Stock</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-200">
              {stats.lowStockItems.map((item) => (
                <tr
                  key={item.id}
                  className="transition-colors hover:bg-zinc-50"
                >
                  <td className="px-5 py-4 font-medium text-zinc-900">
                    {item.product.name}
                  </td>

                  <td className="px-5 py-4 text-zinc-700">{item.quantity}</td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 text-xs font-semibold ${
                        item.quantity === 0
                          ? "bg-red-50 text-red-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {item.quantity === 0 ? "Out of Stock" : "Low Stock"}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <Link
                      href="/admin/inventory"
                      className="font-semibold text-violet-700 transition-colors hover:text-violet-900"
                    >
                      Manage Stock
                    </Link>
                  </td>
                </tr>
              ))}

              {stats.lowStockItems.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-10 text-center text-sm text-zinc-500"
                  >
                    No low-stock products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="overflow-hidden border border-zinc-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 p-5">
          <div>
            <h2 className="text-lg font-semibold text-zinc-950">
              Recent Customers
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Latest 5 registered customers
            </p>
          </div>

          <Link
            href="/admin/customers"
            className="text-sm font-semibold text-violet-700 transition-colors hover:text-violet-900"
          >
            View All Customers
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-162.5 text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Customer</th>
                <th className="px-5 py-4 font-semibold">Email</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">Joined</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-200">
              {stats.recentCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="transition-colors hover:bg-zinc-50"
                >
                  <td className="px-5 py-4 font-medium text-zinc-900">
                    {customer.user.name}
                  </td>

                  <td className="px-5 py-4 text-zinc-600">
                    {customer.user.email}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 text-xs font-semibold ${
                        customer.isActive
                          ? "bg-green-50 text-green-700"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {customer.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-zinc-500">
                    {customer.createdAt.toLocaleDateString()}
                  </td>
                </tr>
              ))}

              {stats.recentCustomers.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-10 text-center text-sm text-zinc-500"
                  >
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminPage;
