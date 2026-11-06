"use server";

import { UpdateInventorySchema } from "@/features/admin/schemas/inventory";
import { db } from "@/lib/prisma";
import { authorizeAdminAction } from "@/lib/role-guard";

export const adjustInventory = async (input: unknown) => {
  const authorization = await authorizeAdminAction();

  if (!authorization.authorized) {
    return {
      success: false,
      error: authorization.error,
    };
  }

  const validation = UpdateInventorySchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0].message,
    };
  }

  const { productId, type, quantity } = validation.data;
  
  try {
    if (type === "ADD") {
      const res = await db.inventory.updateMany({
        where: { product_id: productId },
        data: {
          quantity: {
            increment: quantity,
          },
        },
      });

      if (res.count === 0) {
        return {
          success: false as const,
          error: "Inventory record not found.",
        };
      }
    } else {
      const res = await db.inventory.updateMany({
        where: { product_id: productId, quantity: { gte: quantity } },
        data: {
          quantity: {
            decrement: quantity,
          },
        },
      });

      if (res.count === 0) {
        return {
          success: false,
          error: "Insufficient stock or inventory record not found.",
        };
      }
    }
    return {
      success: true,
      message: "Inventory updated successfully.",
    };
  } catch {
    return {
      success: false,
      error: "Failed to update inventory.",
    };
  }
};
