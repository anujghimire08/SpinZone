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

  const isPreviousDisabled = results.page <= 1;
  const isNextDisabled =
    results.page >= results.totalPages || results.totalData === 0;

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-6 py-10 sm:px-8">
      <div className="flex flex-col gap-4 border-b border-zinc-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
            Customer Management
          </p>

          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
            Customers
          </h1>

          <p className="text-sm leading-6 text-zinc-500">
            Manage and view registered customers.
          </p>
        </div>

        <div className="border border-zinc-200 bg-white px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Total Customers
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-zinc-950">
            {results.totalData}
          </p>
        </div>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-950">
            Filter Customers
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Search customers or filter by account status.
          </p>
        </div>

        <form
          method="GET"
          className="flex flex-col gap-3 border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center"
        >
          <input
            type="search"
            name="search"
            placeholder="Search name, email or phone..."
            defaultValue={search ?? ""}
            className="w-full border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-950 placeholder:text-zinc-400 outline-none transition focus:border-violet-700 focus:ring-2 focus:ring-violet-700/10 sm:flex-1"
          />

          <select
            name="status"
            defaultValue={status ?? "all"}
            className="w-full border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-700 outline-none transition focus:border-violet-700 focus:ring-2 focus:ring-violet-700/10 sm:w-44"
          >
            <option value="all">All Customers</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 cursor-pointer bg-violet-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 sm:flex-none"
            >
              Filter
            </button>

            <Link
              href="/admin/customers"
              className="flex flex-1 items-center justify-center border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 sm:flex-none"
            >
              Reset
            </Link>
          </div>
        </form>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-950">All Customers</h2>
          <p className="mt-1 text-sm text-zinc-500">
            View customer accounts and their activity.
          </p>
        </div>

        <div className="overflow-x-auto border border-zinc-200 bg-white">
          <table className="w-full min-w-225 text-left text-sm">
            <thead className="bg-zinc-50">
              <tr className="border-b border-zinc-200">
                <th className="px-5 py-4 font-semibold text-zinc-600">
                  Customer
                </th>
                <th className="px-5 py-4 font-semibold text-zinc-600">Phone</th>
                <th className="px-5 py-4 font-semibold text-zinc-600">
                  Orders
                </th>
                <th className="px-5 py-4 font-semibold text-zinc-600">
                  Addresses
                </th>
                <th className="px-5 py-4 font-semibold text-zinc-600">
                  Status
                </th>
                <th className="px-5 py-4 font-semibold text-zinc-600">
                  Joined
                </th>
                <th className="px-5 py-4 font-semibold text-zinc-600">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-200">
              {results.customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="transition-colors hover:bg-zinc-50"
                >
                  <td className="px-5 py-4">
                    <p className="font-semibold text-zinc-950">
                      {customer.user.name}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {customer.user.email}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-zinc-600">
                    {customer.phone_number ?? "—"}
                  </td>

                  <td className="px-5 py-4 text-zinc-700">
                    {customer._count.order}
                  </td>

                  <td className="px-5 py-4 text-zinc-700">
                    {customer._count.address}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex border px-2.5 py-1 text-xs font-semibold ${
                        customer.isActive
                          ? "border-green-200 bg-green-50 text-green-700"
                          : "border-red-200 bg-red-50 text-red-700"
                      }`}
                    >
                      {customer.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-zinc-500">
                    {customer.createdAt.toLocaleDateString()}
                  </td>

                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/customers/${customer.id}`}
                      className="font-semibold text-violet-700 transition-colors hover:text-violet-900"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}

              {results.customers.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-sm text-zinc-500"
                  >
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex flex-col gap-4 border-t border-zinc-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-zinc-500">
              Showing{" "}
              <span className="font-semibold text-zinc-950">
                {results.customers.length}
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

export default CustomersPage;
