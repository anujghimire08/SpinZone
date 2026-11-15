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
    <main className="mx-auto w-full max-w-7xl space-y-8 px-6 py-10 sm:px-8">
      <div className="space-y-4 border-b border-zinc-200 pb-6">
        <Link
          href="/admin/customers"
          className="inline-flex text-sm font-medium text-zinc-500 transition-colors hover:text-violet-700"
        >
          Back to Customers
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
              Customer Management
            </p>

            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
              {customer.user.name}
            </h1>

            <p className="text-sm leading-6 text-zinc-500">
              View customer information, addresses, and order history.
            </p>
          </div>

          <CustomerStatusButton
            customerId={customer.id}
            isActive={customer.isActive}
          />
        </div>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-950">
            Customer Information
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Personal details and account activity.
          </p>
        </div>

        <div className="grid gap-px border border-zinc-200 bg-zinc-200 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2 bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Full Name
            </p>
            <p className="text-sm font-semibold text-zinc-950">
              {customer.user.name}
            </p>
          </div>

          <div className="space-y-2 bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Email Address
            </p>
            <p className="break-all text-sm font-semibold text-zinc-950">
              {customer.user.email}
            </p>
          </div>

          <div className="space-y-2 bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Phone Number
            </p>
            <p className="text-sm font-semibold text-zinc-950">
              {customer.phone_number ?? "—"}
            </p>
          </div>

          <div className="space-y-2 bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Account Status
            </p>
            <span
              className={`inline-flex items-center border px-2.5 py-1 text-xs font-semibold ${
                customer.isActive
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {customer.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="space-y-2 bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Registered
            </p>
            <p className="text-sm font-semibold text-zinc-950">
              {customer.user.createdAt.toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-2 bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Total Orders
            </p>
            <p className="text-2xl font-semibold tabular-nums text-zinc-950">
              {customer._count.order}
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-950">Addresses</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Saved customer delivery addresses.
          </p>
        </div>

        {customer.address.length === 0 ? (
          <div className="border border-zinc-200 bg-white px-5 py-10 text-center text-sm text-zinc-500">
            No addresses found.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {customer.address.map((address) => (
              <div
                key={address.id}
                className="space-y-3 border border-zinc-200 bg-white p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-semibold text-zinc-950">
                    {address.street}
                  </h3>

                  {address.is_default && (
                    <span className="shrink-0 border border-violet-200 bg-violet-50 px-2 py-1 text-xs font-semibold text-violet-700">
                      Default
                    </span>
                  )}
                </div>

                <p className="text-sm leading-6 text-zinc-500">
                  {address.city}, {address.state}, {address.country}
                </p>

                <p className="text-sm text-zinc-500">
                  Postal Code: {address.postal_code ?? "—"}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-950">Order History</h2>
          <p className="mt-1 text-sm text-zinc-500">
            All orders placed by this customer.
          </p>
        </div>

        <div className="overflow-x-auto border border-zinc-200 bg-white">
          <table className="w-full min-w-175 text-left text-sm">
            <thead className="bg-zinc-50">
              <tr className="border-b border-zinc-200">
                <th className="px-5 py-4 font-semibold text-zinc-600">
                  Order ID
                </th>
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
              {customer.order.map((order) => (
                <tr
                  key={order.id}
                  className="transition-colors hover:bg-zinc-50"
                >
                  <td className="px-5 py-4 font-medium text-zinc-950">
                    {order.id.slice(-8).toUpperCase()}
                  </td>

                  <td className="px-5 py-4 font-medium text-zinc-700">
                    Rs. {Number(order.total_price).toFixed(2)}
                  </td>

                  <td className="px-5 py-4 text-zinc-600">
                    {order.status.replaceAll("_", " ")}
                  </td>

                  <td className="px-5 py-4 text-zinc-500">
                    {order.createdAt.toLocaleDateString()}
                  </td>

                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-semibold text-violet-700 transition-colors hover:text-violet-900"
                    >
                      View Order
                    </Link>
                  </td>
                </tr>
              ))}

              {customer.order.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
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
    </main>
  );
};

export default CustomerDetailsPage;
