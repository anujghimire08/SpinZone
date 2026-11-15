import { db } from "@/lib/prisma";
import { getStockStatus } from "@/features/admin/utils/inventory";
import InventoryAdjustmentForm from "@/features/admin/components/InventoryAdjustmentForm";

const InventoryPage = async () => {
  const products = await db.product.findMany({
    include: {
      inventory: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-6 py-10 sm:px-8">
      <div className="border-b border-zinc-200 pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
          Inventory Management
        </p>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
          Inventory
        </h1>

        <p className="mt-2 text-sm leading-6 text-zinc-500">
          Monitor product stock levels and manage inventory adjustments.
        </p>
      </div>

      <section className="space-y-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-950">
              Product Stock
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              View current stock levels and adjust quantities.
            </p>
          </div>

          <p className="text-sm text-zinc-500">
            <span className="font-semibold text-zinc-950">
              {products.length}
            </span>{" "}
            products
          </p>
        </div>

        <div className="border border-zinc-200 bg-white">
          {products.map((product) => {
            const quantity = product.inventory?.quantity ?? 0;
            const status = getStockStatus(quantity);

            return (
              <div
                key={product.id}
                className="flex flex-col gap-5 border-b border-zinc-200 p-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 space-y-2">
                  <h3 className="font-semibold text-zinc-950">
                    {product.name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-sm text-zinc-500">
                      Current Stock:{" "}
                      <span className="font-semibold tabular-nums text-zinc-950">
                        {quantity}
                      </span>
                    </p>

                    <span
                      className={`inline-flex border px-2.5 py-1 text-xs font-semibold ${
                        status === "OUT_OF_STOCK"
                          ? "border-red-200 bg-red-50 text-red-700"
                          : status === "LOW_STOCK"
                            ? "border-amber-200 bg-amber-50 text-amber-700"
                            : "border-green-200 bg-green-50 text-green-700"
                      }`}
                    >
                      {status.replaceAll("_", " ")}
                    </span>
                  </div>
                </div>

                <div className="w-full shrink-0 sm:w-auto">
                  <InventoryAdjustmentForm
                    productId={product.id}
                    currentStock={quantity}
                  />
                </div>
              </div>
            );
          })}

          {products.length === 0 && (
            <div className="px-5 py-12 text-center">
              <p className="font-medium text-zinc-950">No products found.</p>
              <p className="mt-1 text-sm text-zinc-500">
                Add products to start managing inventory.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default InventoryPage;
