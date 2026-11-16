"use server";
import { db } from "@/lib/prisma";
import { authorizeCustomerAction } from "@/lib/role-guard";
import { revalidatePath } from "next/cache";
import "server-only";

type UpIn = "ADD" | "SUB";

interface RemoveCartProps {
  cart_id: string;
  product_id: string;
  quantity?: number;
  action: "All" | UpIn;
}

export const removeCart = async ({
  cart_id,
  product_id,
  quantity = 1,
  action,
}: RemoveCartProps) => {
  const authorization = await authorizeCustomerAction();

  if (!authorization.authorized) {
    return {
      success: false as const,
      error: authorization.error ?? "Unauthorized access.",
    };
  }
  const where = { cart_id, product_id };

  if (action === "All") {
    await db.cartItem.deleteMany({
      where,
    });
  } else {
    await db.cartItem.updateMany({
      where,
      data: {
        quantity: {
          [action === "ADD" ? "increment" : "decrement"]: quantity,
        },
      },
    });
  }

  const products = await db.product.findUnique({
    where: { id: product_id },
    include: {
      inventory: {
        select: {
          quantity: true,
        },
      },
    },
  });

  const availableStock = products?.inventory?.quantity ?? 0;

  revalidatePath("/", "layout");

  return {
    success: true as const,
    availableStock,
  };
};
