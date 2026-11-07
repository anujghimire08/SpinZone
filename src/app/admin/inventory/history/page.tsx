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
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Inventory History</h1>
        <p className="text-sm text-gray-500">
          Track all inventory adjustments.
        </p>
      </div>

      <form
        method="GET"
        className="flex flex-wrap items-center gap-3"
        key={`${type ?? "ALL"}-${product_id ?? "ALL"}-${search ?? ""}`}
      >
        <select
          name="type"
          defaultValue={type ?? "ALL"}
          className="rounded-md border px-3 py-2"
        >
          <option value="ALL">All Adjustments</option>
          <option value="ADD">Stock Added</option>
          <option value="REMOVE">Stock Removed</option>
        </select>

        <select
          name="product_id"
          defaultValue={product_id ?? "ALL"}
          className="rounded-md border px-3 py-2"
        >
          <option value="ALL">All Products</option>

          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="search"
          placeholder="Search product, admin name or email..."
          defaultValue={search ?? ""}
          className="rounded-md border w-80 px-3 py-2"
        />

        <button
          type="submit"
          className="rounded-md bg-black px-4 py-2 text-white"
        >
          Filter
        </button>
        <Link
          href="/admin/inventory/history"
          className="rounded-md bg-black px-4 py-2 text-white"
        >
          Reset
        </Link>
      </form>
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {result.history.length} of {result?.totalData} records
        </p>

        <div className="flex gap-2">
          <Link
            href={`?type=${type ?? "ALL"}&product_id=${product_id ?? "ALL"}&search=${encodeURIComponent(search ?? "")}&page=${result.page - 1}`}
            className={`rounded-md border px-4 py-2 ${
              result.page >= result.totalPages
                ? "pointer-events-none opacity-50"
                : ""
            }`}
            aria-disabled={result.page >= result.totalPages}
          >
            Previous
          </Link>

          <span className="px-3 py-2 text-sm">
            Page {result.page} of {Math.max(result?.totalPages, 1)}
          </span>

          <Link
            href={`?type=${type ?? "ALL"}&product_id=${product_id ?? "ALL"}&search=${encodeURIComponent(search ?? "")}&page=${result.page + 1}`}
            className={`rounded-md border px-4 py-2 ${
              currentPage >= result?.totalPages
                ? "pointer-events-none opacity-50"
                : ""
            }`}
            aria-disabled={currentPage >= result?.totalPages}
          >
            Next
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-left">
              <th className="p-3">Product</th>
              <th className="p-3">Admin</th>
              <th className="p-3">Type</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Previous Stock</th>
              <th className="p-3">New Stock</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {result?.history.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-3">{item.product.name}</td>
                <td className="p-3">{item.admin?.name ?? "Admin deleted"}</td>
                <td className="p-3">{item.type}</td>
                <td className="p-3">{item.quantity}</td>
                <td className="p-3">{item.previousQuantity}</td>
                <td className="p-3">{item.newQuantity}</td>
                <td className="p-3">{item.createdAt.toLocaleString()}</td>
              </tr>
            ))}

            {result?.history.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center">
                  No inventory history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryPage;
