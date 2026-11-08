import "server-only";

import { db } from "@/lib/prisma";

export const getCategories = async () => {
  return await db.categorie.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          product: true,
        },
      },
    },
  });
};

export const getCategoryById = async (id: string) => {
  return await db.categorie.findUnique({
    where: { id },
  });
};
