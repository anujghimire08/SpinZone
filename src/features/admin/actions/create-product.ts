"use server";

import { db } from "@/lib/prisma";
import { authorizeAdminAction } from "@/lib/role-guard";
import { CreateProductSchema } from "@/features/admin/schemas/product";

export async function createProduct(input: unknown) {
  // 1. Authentication and authorization
  const authorization = await authorizeAdminAction();

  if (!authorization.authorized) {
    return {
      success: false as const,
      error: authorization.error,
    };
  }

  // 2. Server-side validation
  const validation = CreateProductSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false as const,
      error: "VALIDATION_ERROR" as const,
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  // 3. Database operation
  try {
    const product = await db.product.create({
      data: {
        ...validation.data,
      },
    });

    return {
      success: true as const,
      product,
    };
  } catch (error) {
    console.error("Product creation failed:", error);

    return {
      success: false as const,
      error: "CREATE_PRODUCT_FAILED" as const,
    };
  }
}
