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
    <main className="space-y-6 p-6">
      <Link
        href="/admin/orders"
        className="inline-block text-sm text-gray-500 hover:text-black"
      >
        ← Back to Orders
      </Link>
      <div>
        <h1 className="text-2xl font-bold">Order Details</h1>
        <p className="text-sm text-gray-500">
          Order #{order.id.slice(-8).toUpperCase()}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="space-y-3 rounded-lg border p-5">
          <h2 className="text-lg font-semibold">Customer Information</h2>

          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p>{order.customer?.user.name ?? "Guest"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p>{order.customer?.user.email ?? "Not available"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p>{order.customer?.phone_number ?? "Not available"}</p>
          </div>
        </section>

        <section className="space-y-3 rounded-lg border p-5">
          <h2 className="text-lg font-semibold">Delivery Address</h2>
          <p>{order.address?.country}</p>
          <p>
            {order.address?.city}, {order.address?.state}
          </p>
          <p>{order.address?.postal_code}</p>
        </section>

        <section className="space-y-4 rounded-lg border p-5">
          <h2 className="text-lg font-semibold">Ordered Products</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3">Unit Price</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Subtotal</th>
                </tr>
              </thead>

              <tbody>
                {order.order_item.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="p-3 font-medium">{item.product.name}</td>

                    <td className="p-3">
                      Rs. {Number(item.unit_price).toFixed(2)}
                    </td>

                    <td className="p-3">{item.quantity}</td>

                    <td className="p-3">
                      Rs. {(Number(item.unit_price) * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}

                {order.order_item.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-5 text-center text-gray-500">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end border-t pt-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Order Total</p>
              <p className="text-xl font-bold">
                Rs. {Number(order.total_price).toFixed(2)}
              </p>
            </div>
          </div>
        </section>
        <section className="grid gap-4 rounded-lg border p-5 sm:grid-cols-3">
          <div>
            <p className="text-sm text-gray-500">Order Status</p>
            <p className="font-semibold">{order.status.replaceAll("_", " ")}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Order Date</p>
            <p className="font-semibold">{order.createdAt.toLocaleString()}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Last Updated</p>
            <p className="font-semibold">{order.updatedAt.toLocaleString()}</p>
          </div>
        </section>
        <OrderStatusForm orderId={order.id} currentStatus={order.status} />
      </div>
    </main>
  );
};

export default OrderDetailsPage;
