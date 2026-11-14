"use server";

import { authorizeCustomerAction } from "@/lib/role-guard";
import { AddToCartSchema } from "../schemas/cart";
import { db } from "@/lib/prisma";
import { isRetryableTransactionError } from "@/lib/prisma-retry";

export const addToCart = async (inputs: unknown) => {
  const authorization = await authorizeCustomerAction();
  if (!authorization.authorized) {
    return {
      success: false as const,
      error: authorization.error,
    };
  }

  const validation = AddToCartSchema.safeParse(inputs);

  if (!validation.success) {
    return {
      success: false as const,
      error: validation.error.issues[0]?.message ?? "Invalid cart information.",
    };
  }

  const { productId, quantity } = validation.data;
  const { customer } = authorization;
  try {
    let attempt = 0;
    while (true) {
      attempt++;
      try {
        return await db.$transaction(
          async (tx) => {
            const product = await tx.product.findUnique({
              where: {
                id: productId,
              },
              select: {
                id: true,
                isActive: true,
                inventory: {
                  select: {
                    quantity: true,
                  },
                },
              },
            });

            if (!product || !product.isActive) {
              return {
                success: false as const,
                error: "Product is unavailable.",
              };
            }

            if (!product.inventory || product.inventory.quantity < quantity) {
              return {
                success: false as const,
                error: "Insufficient stock available.",
              };
            }

            const existingCart = await tx.cart.findUnique({
              where: { customer_id: customer.id },
              select: { id: true },
            });

            const existingCartItem = existingCart
              ? await tx.cartItem.findUnique({
                  where: {
                    cart_id_product_id: {
                      cart_id: existingCart.id,
                      product_id: productId,
                    },
                  },
                  select: { id: true, quantity: true },
                })
              : null;

            const totalQuantity = (existingCartItem?.quantity ?? 0) + quantity;

            if (totalQuantity > product.inventory.quantity) {
              return {
                success: false as const,
                error: "Requested quantity exceeds available stock.",
              };
            }

            const cart = existingCart
              ? existingCart
              : await tx.cart.create({
                  data: { customer_id: customer.id },
                  select: { id: true },
                });

            await tx.cartItem.upsert({
              where: {
                cart_id_product_id: {
                  cart_id: cart.id,
                  product_id: productId,
                },
              },
              update: {
                quantity: totalQuantity,
              },
              create: {
                cart_id: cart.id,
                product_id: productId,
                quantity,
              },
            });

            return {
              success: true as const,
              message: "Product added to cart successfully.",
            };
          },
          {
            isolationLevel: "Serializable",
          },
        );
      } catch (error) {
        if (!isRetryableTransactionError(error) || attempt >= 3) {
          throw error;
        }
      }
    }
  } catch (error) {
    console.error("Add to cart error:", error);

    return {
      success: false as const,
      error: "Unable to add product to cart. Please try again.",
    };
  }
};
