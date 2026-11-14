import "server-only";

import { db } from "@/lib/prisma";

export const getStorefrontFilters = async () => {
  const [categories, brands] = await Promise.all([
    db.categorie.findMany({
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
    }),

    db.product.findMany({
      where: {
        isActive: true,
      },
      distinct: ["brand"],
      select: {
        brand: true,
      },
      orderBy: {
        brand: "asc",
      },
    }),
  ]);

  return {
    categories,
    brands: brands.map((item) => item.brand),
  };
};
