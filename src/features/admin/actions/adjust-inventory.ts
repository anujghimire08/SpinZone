"use server";

import { Prisma } from "@/generated/prisma/client";
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
  const adminId = authorization.session.user.id;

  const validation = UpdateInventorySchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0].message,
    };
  }

  const { productId, type, quantity } = validation.data;
  let retries = 0;
  const MAX_RETRIES = 3;
  while (true) {
    try {
      const result = await db.$transaction(
        async (tx) => {
          const inventory = await tx.inventory.findUnique({
            where: {
              product_id: productId,
            },
          });

          if (!inventory) {
            throw new Error("INVENTORY_NOT_FOUND");
          }

          const previousQuantity = inventory.quantity;

          if (type === "REMOVE" && previousQuantity < quantity) {
            throw new Error("INSUFFICIENT_STOCK");
          }

          const newQuantity =
            type === "ADD"
              ? previousQuantity + quantity
              : previousQuantity - quantity;

          await tx.inventory.update({
            where: {
              product_id: productId,
            },
            data: {
              quantity: newQuantity,
            },
          });

          await tx.inventoryAdjustment.create({
            data: {
              product_id: productId,
              admin_id: adminId,
              type,
              quantity,
              previousQuantity,
              newQuantity,
            },
          });

          return {
            previousQuantity,
            newQuantity,
          };
        },
        { isolationLevel: "Serializable" },
      );

      return {
        success: true,
        message: "Inventory updated successfully.",
        data: result,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2034"
      ) {
        if (retries < MAX_RETRIES) {
          retries++;
          continue;
        }

        return {
          success: false,
          error: "Inventory update conflict. Please try again.",
        };
      }
      if (error instanceof Error) {
        if (error.message === "INVENTORY_NOT_FOUND") {
          return {
            success: false,
            error: "Inventory record not found.",
          };
        }

        if (error.message === "INSUFFICIENT_STOCK") {
          return {
            success: false,
            error: "Insufficient stock.",
          };
        }
      }

      return {
        success: false,
        error: "Failed to update inventory.",
      };
    }
  }
};
