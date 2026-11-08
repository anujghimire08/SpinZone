"server-only";

import { db } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

interface getProductPropsType {
  brand?: string;
  product_id?: string;
  search?: string;
  perPage?: number;
  currentPage?: number;
}

export const getProducts = async ({
  brand,
  product_id,
  search,
  perPage = 5,
  currentPage = 1,
}: getProductPropsType) => {
  const where: Prisma.ProductWhereInput = {
    ...(brand && { brand }),
    ...(product_id && { id: product_id }),
    ...(search && {
      OR: [
        {
          categorie: {
            is: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        },
        {
          brand: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          id: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    }),
  };
  const totalData = await db.product.count({ where });
  const totalPages = Math.ceil(totalData / perPage);
  const page = Math.max(1, Math.min(totalPages, currentPage));
  const skip = (page - 1) * perPage;
  const take = perPage;

  const products = await db.product.findMany({
    where,
    skip,
    take,
    include: {
      categorie: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return {
    totalPages,
    page,
    totalData,
    products,
  };
};

export const getProductBrands = async () => {
  return await db.product.findMany({
    distinct: ["brand"],
    select: {
      brand: true,
    },
    orderBy: {
      brand: "asc",
    },
  });
};
