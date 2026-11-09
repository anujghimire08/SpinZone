"use server";

import {
  DeliveryStatus,
  InventoryAdjustmentType,
  Prisma,
} from "@/generated/prisma/client";
import { db } from "@/lib/prisma";
import { authorizeAdminAction } from "@/lib/role-guard";
import { z } from "zod";

const UpdateOrderStatusSchema = z.object({
  orderId: z.string().min(1, "Order ID is required."),
  status: z.enum(DeliveryStatus),
});

export const updateOrderStatus = async (input: unknown) => {
  const authorization = await authorizeAdminAction();

  if (!authorization.authorized) {
    return {
      success: false,
      error: authorization.error ?? "Unauthorized access.",
    };
  }

  const validation = UpdateOrderStatusSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      error: "Invalid order information.",
    };
  }

  const { orderId, status } = validation.data;

  if (status === "CONFIRMED") {
    return {
      success: false,
      error: "Please use the order confirmation process.",
    };
  }

  try {
    await db.$transaction(
      async (tx) => {
        const order = await tx.order.findUnique({
          where: { id: orderId },
          include: {
            order_item: {
              include: {
                product: {
                  select: { name: true },
                },
              },
            },
          },
        });

        if (!order) {
          throw new Error("ORDER_NOT_FOUND");
        }

        if (order.status === "CANCELLED") {
          throw new Error("ORDER_ALREADY_CANCELLED");
        }

        const updatedOrder = await tx.order.updateMany({
          where: {
            id: orderId,
            status: order.status,
          },
          data: { status },
        });

        if (updatedOrder.count !== 1) {
          throw new Error("ORDER_STATUS_CHANGED");
        }

        const stockDeductedStatuses: DeliveryStatus[] = [
          "CONFIRMED",
          "PROCESSING",
          "SHIPPED",
          "OUT_FOR_DELIVERY",
          "DELIVERED",
        ];

        if (
          status === "CANCELLED" &&
          stockDeductedStatuses.includes(order.status)
        ) {
          for (const item of order.order_item) {
            const inventory = await tx.inventory.findUnique({
              where: {
                product_id: item.product_id,
              },
            });

            if (!inventory) {
              throw new Error(`INVENTORY_NOT_FOUND:${item.product.name}`);
            }

            const newQuantity = inventory.quantity + item.quantity;

            await tx.inventory.update({
              where: {
                product_id: item.product_id,
              },
              data: {
                quantity: {
                  increment: item.quantity,
                },
              },
            });

            await tx.inventoryAdjustment.create({
              data: {
                product_id: item.product_id,
                admin_id: authorization.session.user.id,
                type: InventoryAdjustmentType.ADD,
                quantity: item.quantity,
                previousQuantity: inventory.quantity,
                newQuantity,
              },
            });
          }
        }
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "ORDER_NOT_FOUND") {
        return { success: false, error: "Order not found." };
      }

      if (error.message === "ORDER_ALREADY_CANCELLED") {
        return {
          success: false,
          error: "This order is already cancelled.",
        };
      }

      if (error.message === "ORDER_STATUS_CHANGED") {
        return {
          success: false,
          error: "Order status changed. Please refresh and try again.",
        };
      }

      if (error.message.startsWith("INVENTORY_NOT_FOUND:")) {
        return {
          success: false,
          error: `Inventory record missing for ${error.message.slice("INVENTORY_NOT_FOUND:".length)}.`,
        };
      }
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2034"
    ) {
      return {
        success: false,
        error: "Order or inventory changed. Please try again.",
      };
    }

    return {
      success: false,
      error: "Failed to update order status.",
    };
  }
};

export const confirmOrder = async (orderId: string) => {
  const authorization = await authorizeAdminAction();

  if (!authorization.authorized) {
    return {
      success: false,
      error: authorization.error ?? "Unauthorized access.",
    };
  }

  const adminId = authorization.session.user.id;

  try {
    await db.$transaction(
      async (tx) => {
        const order = await tx.order.findUnique({
          where: { id: orderId },
          include: {
            order_item: {
              include: {
                product: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        });

        if (!order) {
          throw new Error("ORDER_NOT_FOUND");
        }

        if (order.status !== "PENDING") {
          throw new Error("ORDER_NOT_PENDING");
        }

        if (order.order_item.length === 0) {
          throw new Error("ORDER_HAS_NO_ITEMS");
        }

        const updatedOrder = await tx.order.updateMany({
          where: {
            id: orderId,
            status: "PENDING",
          },
          data: {
            status: "CONFIRMED",
          },
        });

        if (updatedOrder.count !== 1) {
          throw new Error("ORDER_NOT_PENDING");
        }

        for (const item of order.order_item) {
          const inventory = await tx.inventory.findUnique({
            where: {
              product_id: item.product_id,
            },
          });

          if (!inventory || inventory.quantity < item.quantity) {
            throw new Error(`INSUFFICIENT_STOCK:${item.product.name}`);
          }

          const newQuantity = inventory.quantity - item.quantity;

          const updatedInventory = await tx.inventory.updateMany({
            where: {
              product_id: item.product_id,
              quantity: {
                gte: item.quantity,
              },
            },
            data: {
              quantity: {
                decrement: item.quantity,
              },
            },
          });

          if (updatedInventory.count !== 1) {
            throw new Error(`INSUFFICIENT_STOCK:${item.product.name}`);
          }

          await tx.inventoryAdjustment.create({
            data: {
              product_id: item.product_id,
              admin_id: adminId,
              type: InventoryAdjustmentType.REMOVE,
              quantity: item.quantity,
              previousQuantity: inventory.quantity,
              newQuantity,
            },
          });
        }
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "ORDER_NOT_FOUND") {
        return {
          success: false,
          error: "Order not found.",
        };
      }

      if (error.message === "ORDER_NOT_PENDING") {
        return {
          success: false,
          error: "Only pending orders can be confirmed.",
        };
      }

      if (error.message === "ORDER_HAS_NO_ITEMS") {
        return {
          success: false,
          error: "Cannot confirm an order without products.",
        };
      }

      const stockErrorPrefix = "INSUFFICIENT_STOCK:";

      if (error.message.startsWith(stockErrorPrefix)) {
        const productName = error.message.slice(stockErrorPrefix.length);

        return {
          success: false,
          error: `Insufficient stock for ${productName}.`,
        };
      }
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2034"
    ) {
      return {
        success: false,
        error: "Inventory changed during confirmation. Please try again.",
      };
    }

    return {
      success: false,
      error: "Failed to confirm order.",
    };
  }
};
