"use server";

import { db } from "@/lib/prisma";
import { authorizeAdminAction } from "@/lib/role-guard";
import { z } from "zod";

const UpdateCustomerStatusSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required."),
  isActive: z.boolean(),
});

export const updateCustomerStatus = async (input: unknown) => {
  const authorization = await authorizeAdminAction();

  if (!authorization.authorized) {
    return {
      success: false,
      error: authorization.error ?? "Unauthorized access.",
    };
  }

  const validation = UpdateCustomerStatusSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      error: "Invalid customer information.",
    };
  }

  const { customerId, isActive } = validation.data;

  try {
    const customer = await db.customer.findUnique({
      where: { id: customerId },
      select: { id: true, isActive: true },
    });

    if (!customer) {
      return {
        success: false,
        error: "Customer not found.",
      };
    }

    if (customer.isActive === isActive) {
      return {
        success: false,
        error: `Customer is already ${isActive ? "active" : "inactive"}.`,
      };
    }

    await db.$transaction(async (tx) => {
      await tx.customer.update({
        where: { id: customerId },
        data: { isActive },
      });

      if (!isActive) {
        await tx.session.deleteMany({
          where: {
            user: {
              customer: {
                is: {
                  id: customerId,
                },
              },
            },
          },
        });
      }
    });

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Failed to update customer status.",
    };
  }
};
