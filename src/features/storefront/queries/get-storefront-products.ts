import "server-only";

import { db } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

interface GetStorefrontProductsProps {
  search?: string;
  category?: string;
  brand?: string;
  sort?: "newest" | "price-asc" | "price-desc";
  perPage?: number;
  currentPage?: number;
}

export const getStorefrontProducts = async ({
  search,
  category,
  brand,
  sort = "newest",
  perPage = 12,
  currentPage = 1,
}: GetStorefrontProductsProps) => {
  const where: Prisma.ProductWhereInput = {
    isActive: true,

    ...(brand && { brand }),

    ...(category && {
      categorie: {
        is: {
          slug: category,
        },
      },
    }),

    ...(search?.trim() && {
      OR: [
        {
          name: {
            contains: search.trim(),
            mode: "insensitive",
          },
        },
        {
          brand: {
            contains: search.trim(),
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search.trim(),
            mode: "insensitive",
          },
        },
      ],
    }),
  };

  const totalData = await db.product.count({ where });

  const totalPages = Math.ceil(totalData / perPage);
  const page = Math.max(1, Math.min(totalPages || 1, currentPage));

  const products = await db.product.findMany({
    where,
    skip: (page - 1) * perPage,
    take: perPage,

    include: {
      categorie: {
        select: {
          name: true,
          slug: true,
        },
      },
      inventory: {
        select: {
          quantity: true,
        },
      },
    },

    orderBy:
      sort === "price-asc"
        ? { price: "asc" }
        : sort === "price-desc"
          ? { price: "desc" }
          : { createdAt: "desc" },
  });

  return {
    products,
    totalData,
    totalPages,
    page,
    perPage,
  };
};
