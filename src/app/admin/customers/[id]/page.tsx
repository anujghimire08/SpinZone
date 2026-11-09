import { getCustomerById } from "@/features/admin/queries/get-customers";
import { notFound } from "next/navigation";
import Link from "next/link";
import CustomerStatusButton from "@/features/admin/components/customer-status-button";

interface PageProps {
  params: Promise<{ id: string }>;
}

const CustomerDetailsPage = async ({ params }: PageProps) => {
  const { id } = await params;

  const customer = await getCustomerById(id);

  if (!customer) notFound();

  return (
    <main className="space-y-6 p-6">
      <div>
        <Link
          href="/admin/customers"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to Customers
        </Link>

        <h1 className="mt-3 text-2xl font-bold">{customer.user.name}</h1>

        <p className="text-sm text-gray-500">Customer Details</p>
        <CustomerStatusButton
          customerId={customer.id}
          isActive={customer.isActive}
        />
      </div>
      <div className="grid gap-4 rounded-lg border p-5 sm:grid-cols-2">
        <div>
          <p className="text-sm text-gray-500">Full Name</p>
          <p className="font-medium">{customer.user.name}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium">{customer.user.email}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Phone</p>
          <p className="font-medium">{customer.phone_number ?? "—"}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Account Status</p>
          <p className="font-medium">
            {customer.isActive ? "Active" : "Inactive"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Registered</p>
          <p className="font-medium">
            {customer.user.createdAt.toLocaleDateString()}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="font-medium">{customer._count.order}</p>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Addresses</h2>

        {customer.address.length === 0 ? (
          <p className="text-sm text-gray-500">No addresses found.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {customer.address.map((address) => (
              <div key={address.id} className="rounded-lg border p-4">
                <p className="font-medium">{address.street}</p>
                <p className="text-sm text-gray-500">
                  {address.city}, {address.state}, {address.country}
                </p>
                <p className="text-sm text-gray-500">
                  Postal Code: {address.postal_code ?? "—"}
                </p>
                {address.is_default && (
                  <p className="mt-2 text-sm font-medium">Default Address</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Order History</h2>

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {customer.order.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="p-3 font-medium">
                    {order.id.slice(-8).toUpperCase()}
                  </td>

                  <td className="p-3">
                    Rs. {Number(order.total_price).toFixed(2)}
                  </td>

                  <td className="p-3">{order.status.replaceAll("_", " ")}</td>

                  <td className="p-3">
                    {order.createdAt.toLocaleDateString()}
                  </td>

                  <td className="p-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View Order
                    </Link>
                  </td>
                </tr>
              ))}

              {customer.order.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};

export default CustomerDetailsPage;
