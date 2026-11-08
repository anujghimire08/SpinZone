"server-only";

import { db } from "@/lib/prisma";
import { requireAdmin } from "@/lib/role-guard";
import { Prisma } from "@/generated/prisma/client";

type AdjustmentType = "ADD" | "REMOVE";

interface getInventoryPropsType {
  type?: AdjustmentType;
  product_id?: string;
  search?: string;
  currentPage?: number;
  perPageData?: number;
}

export async function getInventoryHistory({
  type,
  product_id,
  search,
  currentPage = 1,
  perPageData = 5,
}: getInventoryPropsType) {
  await requireAdmin();

  const where: Prisma.InventoryAdjustmentWhereInput = {
    ...(product_id && { product_id }),
    ...(type && { type }),
    ...(search && {
      OR: [
        {
          admin: {
            is: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        },
        {
          admin: {
            is: {
              email: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        },
        {
          product: {
            is: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        },
      ],
    }),
  };
  const totalData = await db.inventoryAdjustment.count({
    where,
  });
  const totalPages = Math.ceil(totalData / perPageData);

  const page = Math.max(1, Math.min(totalPages, currentPage));

  const take = perPageData;
  const skip = (page - 1) * perPageData;

  const history = await db.inventoryAdjustment.findMany({
    where,
    skip,
    take,
    include: {
      product: {
        select: {
          id: true,
          name: true,
        },
      },
      admin: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
  return {
    page,
    totalPages,
    totalData,
    history,
  };
}
