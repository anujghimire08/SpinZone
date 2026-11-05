import { db } from "@/lib/prisma";
import Link from "next/link";

const ProductsPage = async () => {
  const products = await db.product.findMany({
    include: {
      categorie: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-gray-500">Total products: {products.length}</p>
        </div>

        <Link
          href="/admin/products/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-white"
        >
          Add Product
        </Link>
      </div>

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
            {products.map((product) => (
              <tr key={product.id}>
                <td className="border p-3">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="h-12 w-12 rounded-md object-cover"
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
                  {product.isActive ? "Active" : "	Inactive"}
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
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default ProductsPage;
