import { getCustomers } from "@/features/admin/queries/get-customers";
import Link from "next/link";

interface ParamsPropsType {
  searchParams: Promise<{
    status?: string;
    search?: string;
    page?: string;
  }>;
}

const CustomersPage = async ({ searchParams }: ParamsPropsType) => {
  const params = await searchParams;

  const status = params.status;
  const search = params.search || undefined;
  const currentPage = params.page ? Number(params.page) : undefined;

  const isActive =
    status === "active" ? true : status === "inactive" ? false : undefined;

  const results = await getCustomers({ isActive, search, currentPage });

  const createPageUrl = (page: number) => {
    const query = new URLSearchParams();

    if (search) query.set("search", search);
    if (status && status !== "all") query.set("status", status);
    if (page) query.set("page", String(page));

    return `/admin/customers?${query.toString()}`;
  };

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Customers</h1>
        <p className="text-sm text-gray-500">
          Manage and view registered customers.
        </p>
      </div>

      <form method="GET" className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          name="search"
          placeholder="Search name, email or phone..."
          defaultValue={search ?? ""}
          className="rounded-md border px-3 py-2"
        />

        <select
          name="status"
          defaultValue={status ?? "all"}
          className="rounded-md border px-3 py-2"
        >
          <option value="all">All Customers</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
        >
          Filter
        </button>

        <Link href="/admin/customers" className="rounded-md border px-4 py-2">
          Reset
        </Link>
      </form>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Customer</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Orders</th>
              <th className="p-3">Addresses</th>
              <th className="p-3">Status</th>
              <th className="p-3">Joined</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {results.customers.map((customer) => (
              <tr key={customer.id} className="border-t">
                <td className="p-3">
                  <div className="font-medium">{customer.user.name}</div>
                  <div className="text-xs text-gray-500">
                    {customer.user.email}
                  </div>
                </td>

                <td className="p-3">{customer.phone_number ?? "—"}</td>

                <td className="p-3">{customer._count.order}</td>

                <td className="p-3">{customer._count.address}</td>

                <td className="p-3">
                  {customer.isActive ? "Active" : "Inactive"}
                </td>

                <td className="p-3">
                  {customer.createdAt.toLocaleDateString()}
                </td>

                <td className="p-3">
                  <Link
                    href={`/admin/customers/${customer.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}

            {results.customers.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-500">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex items-center justify-between p-3">
          <p className="text-sm text-gray-500">
            Showing {results.customers.length} of {results.totalData} records
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

export default CustomersPage;
