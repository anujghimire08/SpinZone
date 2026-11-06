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
    <div>
      <h1>Inventory Management</h1>

      <div className="mt-6 space-y-4">
        {products.map((product) => {
          const quantity = product.inventory?.quantity ?? 0;
          const status = getStockStatus(quantity);

          return (
            <div
              key={product.id}
              className="flex items-center justify-between rounded-md border p-4"
            >
              <div>
                <h2 className="font-medium">{product.name}</h2>
                <p className="text-sm text-gray-500">Stock: {quantity}</p>
              </div>

              <InventoryAdjustmentForm
                productId={product.id}
                currentStock={quantity}
              />

              <span
                className={`rounded-full px-3 py-1 text-sm ${
                  status === "OUT_OF_STOCK"
                    ? "bg-red-100 text-red-700"
                    : status === "LOW_STOCK"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                }`}
              >
                {status.replaceAll("_", " ")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InventoryPage;
