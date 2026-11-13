import Image from "@/features/admin/components/Image";
import {
  getProductBrands,
  getProducts,
} from "@/features/admin/queries/get-products";
import Link from "next/link";

interface ParamsType {
  searchParams: Promise<{
    brand?: string;
    product_id?: string;
    search?: string;
    page?: string;
  }>;
}

const ProductsPage = async ({ searchParams }: ParamsType) => {
  const params = await searchParams;

  const brand =
    params.brand && params.brand !== "ALL" ? params.brand : undefined;

  const product_id =
    params.product_id && params.product_id !== "ALL"
      ? params.product_id
      : undefined;

  const search = params.search?.trim() || undefined;

  const currentPage = Math.max(1, Number(params.page) || 1);

  const [result, brands] = await Promise.all([
    getProducts({ brand, product_id, search, currentPage }),
    getProductBrands(),
  ]);

  const createPageUrl = (page: number) => {
    const query = new URLSearchParams();

    if (brand) query.set("brand", brand);
    if (product_id) query.set("product_id", product_id);
    if (search) query.set("search", search);

    query.set("page", String(page));

    return `/admin/products?${query.toString()}`;
  };

  const pages = Array.from(
    { length: result.totalPages },
    (_, index) => index + 1,
  );

  return (
    <main className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-gray-500">Total products: {result.totalData}</p>
        </div>

        <Link
          href="/admin/products/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-white"
        >
          Add Product
        </Link>
      </div>

      <form
        method="GET"
        className="mb-6 flex flex-wrap gap-3"
        key={`${brand},${pages},${product_id}`}
      >
        <select
          name="brand"
          defaultValue={brand ?? "ALL"}
          className="rounded-md border px-3 py-2"
        >
          <option value="ALL">All Brands</option>

          {brands.map((item) => (
            <option key={item.brand} value={item.brand}>
              {item.brand}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="search"
          placeholder="Search products..."
          defaultValue={search ?? ""}
          className="rounded-md border px-3 py-2"
        />

        <button
          type="submit"
          className="rounded-md bg-black px-4 py-2 text-white"
        >
          Filter
        </button>

        <Link
          href="/admin/products"
          className="rounded-md bg-gray-200 px-4 py-2"
        >
          Clear Filters
        </Link>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border p-3">Image</th>
              <th className="border p-3">Name</th>
              <th className="border p-3">Category</th>
              <th className="border p-3">Brand</th>
              <th className="border p-3">Price</th>
              <th className="border p-3">Discount</th>
              <th className="border p-3">Status</th>
              <th className="border p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {result.products.length > 0 ? (
              result.products.map((product) => (
                <tr key={product.id}>
                  <td className="border p-3">
                    <Image
                      src={product.img}
                      alt={product.name}
                      className="object-cover"
                      width={40}
                      height={40}
                      fallbackText="404"
                    />
                  </td>

                  <td className="border p-3">{product.name}</td>
                  <td className="border p-3">{product.categorie.name}</td>
                  <td className="border p-3">{product.brand}</td>
                  <td className="border p-3">${product.price.toString()}</td>

                  <td className="border p-3">
                    {product.discount_percent
                      ? `${product.discount_percent.toString()}%`
                      : "—"}
                  </td>

                  <td className="border p-3">
                    {product.isActive ? "Active" : "Inactive"}
                  </td>

                  <td className="border p-3">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {result.totalPages > 0 && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            Showing page {result.page} of {result.totalPages}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={createPageUrl(result.page - 1)}
              aria-disabled={result.page <= 1}
              className={`rounded-md border px-3 py-2 text-sm ${
                result.page <= 1
                  ? "pointer-events-none opacity-50"
                  : "hover:bg-gray-100"
              }`}
            >
              Previous
            </Link>

            {pages.map((page) => (
              <Link
                key={page}
                href={createPageUrl(page)}
                aria-current={result.page === page ? "page" : undefined}
                className={`rounded-md border px-3 py-2 text-sm ${
                  result.page === page
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {page}
              </Link>
            ))}

            <Link
              href={createPageUrl(result.page + 1)}
              aria-disabled={result.page >= result.totalPages}
              className={`rounded-md border px-3 py-2 text-sm ${
                result.page >= result.totalPages
                  ? "pointer-events-none opacity-50"
                  : "hover:bg-gray-100"
              }`}
            >
              Next
            </Link>
          </div>
        </div>
      )}
    </main>
  );
};

export default ProductsPage;
