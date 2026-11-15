import { getInventoryHistory } from "@/features/admin/queries/get-inventory-history";
import { db } from "@/lib/prisma";
import { requireAdmin } from "@/lib/role-guard";
import Link from "next/link";

interface ParamsType {
  searchParams: Promise<{
    type?: string;
    product_id?: string;
    search?: string;
    page?: string;
  }>;
}

const HistoryPage = async ({ searchParams }: ParamsType) => {
  await requireAdmin();

  const params = await searchParams;

  const type =
    params.type === "ADD" || params.type === "REMOVE" ? params.type : undefined;

  const product_id =
    params.product_id && params.product_id !== "ALL"
      ? params.product_id
      : undefined;

  const search = params.search?.trim() || undefined;
  const currentPage = Math.max(1, Number(params.page) || 1);

  const [result, products] = await Promise.all([
    getInventoryHistory({ type, product_id, search, currentPage }),
    db.product.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  const createPageUrl = (page: number) => {
    const query = new URLSearchParams();

    if (type) query.set("type", type);
    if (product_id) query.set("product_id", product_id);
    if (search) query.set("search", search);
    if (page > 1) query.set("page", String(page));

    return `/admin/inventory/history?${query.toString()}`;
  };

  const isPreviousDisabled = result.page <= 1;
  const isNextDisabled =
    result.page >= result.totalPages || result.totalData === 0;

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-6 py-10 sm:px-8">
      <div className="flex flex-col gap-4 border-b border-zinc-200 pb-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
            Inventory Management
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
            Inventory History
          </h1>
          <p className="text-sm leading-6 text-zinc-500">
            Track stock additions, removals, and inventory adjustments.
          </p>
        </div>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-950">
            Filter History
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Search inventory records or filter by adjustment type and product.
          </p>
        </div>

        <form
          method="GET"
          key={`${type ?? "ALL"}-${product_id ?? "ALL"}-${search ?? ""}`}
          className="flex flex-col gap-3 border border-zinc-200 bg-white p-4 sm:flex-row sm:flex-wrap sm:items-center"
        >
          <select
            name="type"
            defaultValue={type ?? "ALL"}
            className="w-full border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-700 outline-none transition focus:border-violet-700 focus:ring-2 focus:ring-violet-700/10 sm:w-44"
          >
            <option value="ALL">All Adjustments</option>
            <option value="ADD">Stock Added</option>
            <option value="REMOVE">Stock Removed</option>
          </select>

          <select
            name="product_id"
            defaultValue={product_id ?? "ALL"}
            className="w-full border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-700 outline-none transition focus:border-violet-700 focus:ring-2 focus:ring-violet-700/10 sm:w-56"
          >
            <option value="ALL">All Products</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>

          <input
            type="search"
            name="search"
            placeholder="Search product, admin name or email..."
            defaultValue={search ?? ""}
            className="w-full border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-950 placeholder:text-zinc-400 outline-none transition focus:border-violet-700 focus:ring-2 focus:ring-violet-700/10 sm:min-w-64 sm:flex-1"
          />

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 cursor-pointer bg-violet-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 sm:flex-none"
            >
              Filter
            </button>

            <Link
              href="/admin/inventory/history"
              className="flex flex-1 items-center justify-center border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 sm:flex-none"
            >
              Reset
            </Link>
          </div>
        </form>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-950">
            Adjustment Records
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Review previous and updated stock quantities for each adjustment.
          </p>
        </div>

        <div className="overflow-x-auto border border-zinc-200 bg-white">
          <table className="w-full min-w-225 text-left text-sm">
            <thead className="bg-zinc-50">
              <tr className="border-b border-zinc-200">
                <th className="px-5 py-4 font-semibold text-zinc-600">
                  Product
                </th>
                <th className="px-5 py-4 font-semibold text-zinc-600">Admin</th>
                <th className="px-5 py-4 font-semibold text-zinc-600">Type</th>
                <th className="px-5 py-4 font-semibold text-zinc-600">
                  Quantity
                </th>
                <th className="px-5 py-4 font-semibold text-zinc-600">
                  Previous Stock
                </th>
                <th className="px-5 py-4 font-semibold text-zinc-600">
                  New Stock
                </th>
                <th className="px-5 py-4 font-semibold text-zinc-600">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-200">
              {result.history.map((item) => (
                <tr
                  key={item.id}
                  className="transition-colors hover:bg-zinc-50"
                >
                  <td className="px-5 py-4 font-semibold text-zinc-950">
                    {item.product.name}
                  </td>

                  <td className="px-5 py-4 text-zinc-600">
                    {item.admin?.name ?? "Admin deleted"}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex border px-2.5 py-1 text-xs font-semibold ${
                        item.type === "ADD"
                          ? "border-green-200 bg-green-50 text-green-700"
                          : "border-red-200 bg-red-50 text-red-700"
                      }`}
                    >
                      {item.type === "ADD" ? "Stock Added" : "Stock Removed"}
                    </span>
                  </td>

                  <td className="px-5 py-4 font-semibold tabular-nums text-zinc-950">
                    {item.quantity}
                  </td>

                  <td className="px-5 py-4 tabular-nums text-zinc-600">
                    {item.previousQuantity}
                  </td>

                  <td className="px-5 py-4 font-semibold tabular-nums text-zinc-950">
                    {item.newQuantity}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-zinc-500">
                    {item.createdAt.toLocaleString()}
                  </td>
                </tr>
              ))}

              {result.history.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-sm text-zinc-500"
                  >
                    No inventory history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex flex-col gap-4 border-t border-zinc-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-zinc-500">
              Showing{" "}
              <span className="font-semibold text-zinc-950">
                {result.history.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-zinc-950">
                {result.totalData}
              </span>{" "}
              records
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={createPageUrl(result.page - 1)}
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
                  {result.page}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-zinc-950">
                  {Math.max(result.totalPages, 1)}
                </span>
              </span>

              <Link
                href={createPageUrl(result.page + 1)}
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

export default HistoryPage;
