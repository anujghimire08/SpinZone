import RevenueChart from "@/features/admin/components/revenue-chart";
import { getDashboardStats } from "@/features/admin/queries/get-dashboard-stats";
import { getMonthlyRevenue } from "@/features/admin/queries/get-monthly-revenue";
import Link from "next/link";

const AdminPage = async () => {
  const stats = await getDashboardStats();
  const monthlyRevenue = await getMonthlyRevenue();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Revenue Analytics</h2>
          <p className="text-sm text-gray-500">
            Monthly revenue from delivered orders (last 6 months)
          </p>
        </div>

        <RevenueChart data={monthlyRevenue} />
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-5">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <h2 className="mt-2 text-2xl font-bold">
            Rs. {stats.totalRevenue.toLocaleString("en-IN")}
          </h2>
        </div>

        <div className="rounded-lg border p-5">
          <p className="text-sm text-gray-500">Total Orders</p>
          <h2 className="mt-2 text-2xl font-bold">{stats.totalOrders}</h2>
        </div>

        <div className="rounded-lg border p-5">
          <p className="text-sm text-gray-500">Total Customers</p>
          <h2 className="mt-2 text-2xl font-bold">{stats.totalCustomers}</h2>
        </div>

        <div className="rounded-lg border p-5">
          <p className="text-sm text-gray-500">Total Products</p>
          <h2 className="mt-2 text-2xl font-bold">{stats.totalProducts}</h2>
        </div>

        <div className="rounded-lg border p-5">
          <p className="text-sm text-gray-500">Pending Orders</p>
          <h2 className="mt-2 text-2xl font-bold">{stats.pendingOrders}</h2>
        </div>

        <div className="rounded-lg border p-5">
          <p className="text-sm text-gray-500">Low Stock Products</p>
          <h2 className="mt-2 text-2xl font-bold">{stats.lowStockProducts}</h2>
        </div>
      </div>
      {/* Order Status Overview */}
      <section className="space-y-4 rounded-lg border p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Order Status Overview</h2>
            <p className="text-sm text-gray-500">
              Breakdown of all orders by delivery status
            </p>
          </div>

          <Link
            href="/admin/orders"
            className="shrink-0 text-sm text-blue-600 hover:underline"
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
              <div key={status} className="rounded-md bg-gray-50 p-4">
                <p className="text-sm text-gray-500">
                  {status.replaceAll("_", " ")}
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {orderStatus?._count._all ?? 0}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="overflow-x-auto rounded-lg border">
        <div className="flex items-center justify-between gap-3 border-b p-5">
          <div>
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <p className="text-sm text-gray-500">Latest 5 customer orders</p>
          </div>

          <Link
            href="/admin/orders"
            className="shrink-0 text-sm text-blue-600 hover:underline"
          >
            View All Orders
          </Link>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Items</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>

          <tbody>
            {stats.recentOrders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="p-4">#{order.id.slice(-8)}</td>

                <td className="p-4">{order.customer?.user.name ?? "Guest"}</td>

                <td className="p-4">{order._count.order_item}</td>

                <td className="p-4">
                  Rs. {Number(order.total_price).toLocaleString("en-IN")}
                </td>

                <td className="p-4">{order.status.replaceAll("_", " ")}</td>

                <td className="p-4">{order.createdAt.toLocaleDateString()}</td>
              </tr>
            ))}

            {stats.recentOrders.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="overflow-x-auto rounded-lg border">
        <div className="flex items-center justify-between gap-3 border-b p-5">
          <div>
            <h2 className="text-lg font-semibold">Low Stock Products</h2>
            <p className="text-sm text-gray-500">
              Products that need restocking (5 or fewer items)
            </p>
          </div>

          <Link
            href="/admin/inventory"
            className="shrink-0 text-sm text-blue-600 hover:underline"
          >
            View All Inventory
          </Link>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Available Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {stats.lowStockItems.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-4">{item.product.name}</td>

                <td className="p-4">{item.quantity}</td>

                <td className="p-4">
                  {item.quantity === 0 ? "Out of Stock" : "Low Stock"}
                </td>

                <td className="p-4">
                  <Link
                    href="/admin/inventory"
                    className="text-blue-600 hover:underline"
                  >
                    Manage Stock
                  </Link>
                </td>
              </tr>
            ))}

            {stats.lowStockItems.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">
                  No low-stock products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
      <section className="overflow-x-auto rounded-lg border">
        <div className="flex items-center justify-between gap-3 border-b p-5">
          <div>
            <h2 className="text-lg font-semibold">Recent Customers</h2>
            <p className="text-sm text-gray-500">
              Latest 5 registered customers
            </p>
          </div>

          <Link
            href="/admin/customers"
            className="shrink-0 text-sm text-blue-600 hover:underline"
          >
            View All Customers
          </Link>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4">Customer</th>
              <th className="p-4">Email</th>
              <th className="p-4">Status</th>
              <th className="p-4">Joined</th>
            </tr>
          </thead>

          <tbody>
            {stats.recentCustomers.map((customer) => (
              <tr key={customer.id} className="border-t">
                <td className="p-4">{customer.user.name}</td>

                <td className="p-4">{customer.user.email}</td>

                <td className="p-4">
                  {customer.isActive ? "Active" : "Inactive"}
                </td>

                <td className="p-4">
                  {customer.createdAt.toLocaleDateString()}
                </td>
              </tr>
            ))}

            {stats.recentCustomers.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default AdminPage;
