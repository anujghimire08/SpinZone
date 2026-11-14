import "server-only";

import { db } from "@/lib/prisma";

export const getStorefrontCategories = async () => {
  return await db.categorie.findMany({
    where: {
      product: {
        some: {
          isActive: true,
        },
      },
    },
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: {
      name: "asc",
    },
  });
};
