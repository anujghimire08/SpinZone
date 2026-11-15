import OrderStatusForm from "@/features/admin/components/order-status-form";
import { getOrderById } from "@/features/admin/queries/get-orders";
import Link from "next/link";
import { notFound } from "next/navigation";

interface OrderDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

const OrderDetailsPage = async ({ params }: OrderDetailsPageProps) => {
  const { id } = await params;

  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-6 py-10 sm:px-8">
      <div className="space-y-4 border-b border-zinc-200 pb-6">
        <Link
          href="/admin/orders"
          className="inline-flex text-sm font-medium text-zinc-500 transition-colors hover:text-violet-700"
        >
          Back to Orders
        </Link>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
            Order Management
          </p>

          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
            Order Details
          </h1>

          <p className="text-sm text-zinc-500">
            Order #
            <span className="font-semibold text-zinc-700">
              {order.id.slice(-8).toUpperCase()}
            </span>
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="space-y-5 border border-zinc-200 bg-white p-5 sm:p-6">
          <div>
            <h2 className="text-lg font-semibold text-zinc-950">
              Customer Information
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Contact details associated with this order.
            </p>
          </div>

          <div className="divide-y divide-zinc-200">
            <div className="py-3 first:pt-0">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                Name
              </p>
              <p className="mt-1 text-sm font-medium text-zinc-950">
                {order.customer?.user.name ?? "Guest"}
              </p>
            </div>

            <div className="py-3">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                Email
              </p>
              <p className="mt-1 break-all text-sm text-zinc-700">
                {order.customer?.user.email ?? "Not available"}
              </p>
            </div>

            <div className="py-3 last:pb-0">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                Phone
              </p>
              <p className="mt-1 text-sm text-zinc-700">
                {order.customer?.phone_number ?? "Not available"}
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-5 border border-zinc-200 bg-white p-5 sm:p-6">
          <div>
            <h2 className="text-lg font-semibold text-zinc-950">
              Delivery Address
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Shipping destination for this order.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-zinc-950">
              {order.address?.country ?? "Not available"}
            </p>

            <p className="text-sm text-zinc-600">
              {order.address?.city ?? "Not available"}
              {order.address?.state ? `, ${order.address.state}` : ""}
            </p>

            <div className="border-t border-zinc-200 pt-3">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                Postal Code
              </p>
              <p className="mt-1 text-sm text-zinc-700">
                {order.address?.postal_code ?? "Not available"}
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-5 border border-zinc-200 bg-white p-5 sm:col-span-2 sm:p-6">
          <div>
            <h2 className="text-lg font-semibold text-zinc-950">
              Ordered Products
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Products and quantities included in this order.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-162.5 text-left text-sm">
              <thead className="bg-zinc-50">
                <tr className="border-b border-zinc-200">
                  <th className="px-5 py-4 font-semibold text-zinc-600">
                    Product
                  </th>
                  <th className="px-5 py-4 font-semibold text-zinc-600">
                    Unit Price
                  </th>
                  <th className="px-5 py-4 font-semibold text-zinc-600">
                    Quantity
                  </th>
                  <th className="px-5 py-4 text-right font-semibold text-zinc-600">
                    Subtotal
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-200">
                {order.order_item.map((item) => (
                  <tr
                    key={item.id}
                    className="transition-colors hover:bg-zinc-50"
                  >
                    <td className="px-5 py-4 font-semibold text-zinc-950">
                      {item.product.name}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap text-zinc-600">
                      Rs. {Number(item.unit_price).toFixed(2)}
                    </td>

                    <td className="px-5 py-4 tabular-nums text-zinc-700">
                      {item.quantity}
                    </td>

                    <td className="px-5 py-4 text-right font-medium tabular-nums text-zinc-950">
                      Rs. {(Number(item.unit_price) * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}

                {order.order_item.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-12 text-center text-sm text-zinc-500"
                    >
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end border-t border-zinc-200 pt-5">
            <div className="text-right">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                Order Total
              </p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-zinc-950">
                Rs. {Number(order.total_price).toFixed(2)}
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-5 border border-zinc-200 bg-white p-5 sm:col-span-2 sm:p-6">
          <div>
            <h2 className="text-lg font-semibold text-zinc-950">
              Order Information
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Current status and order timestamps.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                Order Status
              </p>
              <p className="mt-2 text-sm font-semibold text-zinc-950">
                {order.status.replaceAll("_", " ")}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                Order Date
              </p>
              <p className="mt-2 text-sm font-medium text-zinc-700">
                {order.createdAt.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                Last Updated
              </p>
              <p className="mt-2 text-sm font-medium text-zinc-700">
                {order.updatedAt.toLocaleString()}
              </p>
            </div>
          </div>
        </section>

        <div className="sm:col-span-2">
          <OrderStatusForm orderId={order.id} currentStatus={order.status} />
        </div>
      </div>
    </main>
  );
};

export default OrderDetailsPage;
