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

  const isPreviousDisabled = result.page <= 1;
  const isNextDisabled = result.page >= result.totalPages;

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-6 py-10 sm:px-8">
      <header className="flex flex-col gap-5 border-b border-zinc-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
            Product Management
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
            Products
          </h1>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Manage your product catalog, pricing, and availability.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex w-fit items-center justify-center bg-violet-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2"
        >
          Add Product
        </Link>
      </header>

      <section className="border border-zinc-200 bg-white p-5">
        <p className="text-sm font-medium text-zinc-500">Total Products</p>
        <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
          {result.totalData}
        </p>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-950">
            Product Catalog
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Search and filter products to find what you need.
          </p>
        </div>

        <form
          method="GET"
          key={`${brand ?? ""}-${search ?? ""}-${product_id ?? ""}`}
          className="flex flex-col gap-3 border border-zinc-200 bg-white p-4 sm:flex-row sm:flex-wrap sm:items-center"
        >
          <select
            name="brand"
            defaultValue={brand ?? "ALL"}
            className="w-full border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-700 outline-none transition focus:border-violet-700 focus:ring-2 focus:ring-violet-700/10 sm:w-52"
          >
            <option value="ALL">All Brands</option>

            {brands.map((item) => (
              <option key={item.brand} value={item.brand}>
                {item.brand}
              </option>
            ))}
          </select>

          <input
            type="search"
            name="search"
            placeholder="Search products..."
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
              href="/admin/products"
              className="flex flex-1 items-center justify-center border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 sm:flex-none"
            >
              Clear Filters
            </Link>
          </div>
        </form>

        <div className="overflow-hidden border border-zinc-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-237.5 border-collapse text-left">
              <thead className="bg-zinc-50">
                <tr className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  <th className="px-5 py-4">Image</th>
                  <th className="px-5 py-4">Product</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Brand</th>
                  <th className="px-5 py-4">Price</th>
                  <th className="px-5 py-4">Discount</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-200">
                {result.products.length > 0 ? (
                  result.products.map((product) => (
                    <tr
                      key={product.id}
                      className="transition-colors hover:bg-zinc-50"
                    >
                      <td className="px-5 py-4">
                        <Image
                          src={product.img}
                          alt={product.name}
                          className="object-cover"
                          width={48}
                          height={48}
                          fallbackText="404"
                        />
                      </td>

                      <td className="px-5 py-4">
                        <p className="max-w-56 truncate text-sm font-semibold text-zinc-950">
                          {product.name}
                        </p>
                        <p className="mt-1 text-xs text-zinc-400">
                          {product.slug}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-zinc-600">
                        {product.categorie.name}
                      </td>

                      <td className="px-5 py-4 text-sm text-zinc-600">
                        {product.brand}
                      </td>

                      <td className="px-5 py-4 text-sm font-medium text-zinc-950">
                        ${product.price.toString()}
                      </td>

                      <td className="px-5 py-4 text-sm text-zinc-600">
                        {product.discount_percent
                          ? `${product.discount_percent.toString()}%`
                          : "—"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold ${
                            product.isActive
                              ? "bg-green-50 text-green-700"
                              : "bg-zinc-100 text-zinc-600"
                          }`}
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="text-sm font-semibold text-violet-700 transition-colors hover:text-violet-900"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-5 py-12 text-center text-sm text-zinc-500"
                    >
                      No products found. Try changing your search or filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {result.totalPages > 0 && (
        <div className="flex flex-col gap-4 border-t border-zinc-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-500">
            Showing page{" "}
            <span className="font-semibold text-zinc-950">{result.page}</span>{" "}
            of{" "}
            <span className="font-semibold text-zinc-950">
              {result.totalPages}
            </span>
          </p>

          <nav
            aria-label="Product pagination"
            className="flex flex-wrap items-center gap-2"
          >
            <Link
              href={createPageUrl(result.page - 1)}
              aria-disabled={isPreviousDisabled}
              tabIndex={isPreviousDisabled ? -1 : undefined}
              className={`border px-3 py-2 text-sm font-medium transition-colors ${
                isPreviousDisabled
                  ? "pointer-events-none border-zinc-200 text-zinc-400"
                  : "border-zinc-300 text-zinc-700 hover:bg-zinc-100"
              }`}
            >
              Previous
            </Link>

            {pages.map((page) => (
              <Link
                key={page}
                href={createPageUrl(page)}
                aria-current={result.page === page ? "page" : undefined}
                className={`border px-3 py-2 text-sm font-medium transition-colors ${
                  result.page === page
                    ? "border-violet-700 bg-violet-700 text-white"
                    : "border-zinc-300 text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                {page}
              </Link>
            ))}

            <Link
              href={createPageUrl(result.page + 1)}
              aria-disabled={isNextDisabled}
              tabIndex={isNextDisabled ? -1 : undefined}
              className={`border px-3 py-2 text-sm font-medium transition-colors ${
                isNextDisabled
                  ? "pointer-events-none border-zinc-200 text-zinc-400"
                  : "border-zinc-300 text-zinc-700 hover:bg-zinc-100"
              }`}
            >
              Next
            </Link>
          </nav>
        </div>
      )}
    </main>
  );
};

export default ProductsPage;
