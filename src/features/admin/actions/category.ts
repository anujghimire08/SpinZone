"use server";
import { db } from "@/lib/prisma";
import { authorizeAdminAction } from "@/lib/role-guard";
import { CreateCategorySchema } from "@/features/admin/schemas/category";
import { Prisma } from "@/generated/prisma/client";

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

export const createCategory = async (input: unknown) => {
  const authorization = await authorizeAdminAction();

  if (!authorization.authorized) {
    return {
      success: false,
      error: authorization.error ?? "Unauthorized",
    };
  }

  const validation = CreateCategorySchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0].message,
    };
  }

  const name = validation.data.name;
  const slug = generateSlug(name);

  try {
    await db.categorie.create({
      data: {
        name,
        slug,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        error: "Category name or slug already exists.",
      };
    }

    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
};

export const updateCategory = async (id: string, input: unknown) => {
  const authorization = await authorizeAdminAction();

  if (!authorization.authorized) {
    return {
      success: false,
      error: authorization.error ?? "Unauthorized",
    };
  }

  const validation = CreateCategorySchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0].message,
    };
  }

  const { name } = validation.data;

  const slug = generateSlug(name);

  try {
    await db.categorie.update({
      where: { id },
      data: {
        name,
        slug,
      },
    });

    return { success: true };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        error: "Category name or slug already exists.",
      };
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return {
        success: false,
        error: "Category not found.",
      };
    }

    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
};

export const deleteCategory = async (id: string) => {
  const authorization = await authorizeAdminAction();

  if (!authorization.authorized) {
    return {
      success: false,
      error: authorization.error ?? "Unauthorized",
    };
  }

  try {
    return await db.$transaction(
      async (tx) => {
        const category = await tx.categorie.findUnique({
          where: { id },
          include: {
            _count: {
              select: {
                product: true,
              },
            },
          },
        });

        if (!category) {
          return {
            success: false,
            error: "Category not found.",
          };
        }

        if (category._count.product > 0) {
          return {
            success: false,
            error: "Cannot delete a category that has products.",
          };
        }

        await tx.categorie.delete({
          where: { id },
        });

        return { success: true };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2034"
    ) {
      return {
        success: false,
        error: "Database conflict. Please try again.",
      };
    }

    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
};
