"use server";

import { db } from "@/lib/prisma";
import { authorizeAdminAction } from "@/lib/role-guard";

export async function deleteProduct(id: string) {
  // 1. Authorization
  const authorization = await authorizeAdminAction();

  if (!authorization.authorized) {
    return {
      success: false as const,
      error: authorization.error,
    };
  }

  try {
    // 2. Check whether the product exists
    const product = await db.product.findUnique({
      where: { id },
      select: {
        id: true,
        _count: {
          select: {
            order_item: true,
          },
        },
      },
    });

    if (!product) {
      return {
        success: false as const,
        error: "PRODUCT_NOT_FOUND" as const,
      };
    }

    // 3. Protect existing order history
    if (product._count.order_item > 0) {
      return {
        success: false as const,
        error: "PRODUCT_HAS_ORDERS" as const,
      };
    }

    // 4. Delete product
    await db.product.delete({
      where: { id },
    });

    return {
      success: true as const,
    };
  } catch (error) {
    console.error("Product deletion failed:", error);

    return {
      success: false as const,
      error: "DELETE_PRODUCT_FAILED" as const,
    };
  }
}
