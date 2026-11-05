"use server";

import { db } from "@/lib/prisma";
import { authorizeAdminAction } from "@/lib/role-guard";
import { CreateProductSchema } from "@/features/admin/schemas/product";

export async function updateProduct(id: string, input: unknown) {
  // 1. Authorization
  const authorization = await authorizeAdminAction();

  if (!authorization.authorized) {
    return {
      success: false as const,
      error: authorization.error,
    };
  }

  // 2. Validation
  const validation = CreateProductSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false as const,
      error: "VALIDATION_ERROR" as const,
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  // 3. Update product
  try {
    const product = await db.product.update({
      where: { id },
      data: validation.data,
    });

    return {
      success: true as const,
      product,
    };
  } catch (error) {
    return {
      success: false as const,
      error: "UPDATE_PRODUCT_FAILED" as const,
    };
  }
}
