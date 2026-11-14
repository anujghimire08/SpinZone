import "server-only";

import { db } from "@/lib/prisma";

export const getStorefrontProductBySlug = async (slug: string) => {
  return db.product.findFirst({
    where: {
      slug,
      isActive: true,
    },
    include: {
      categorie: {
        select: {
          id: true,
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
  });
};
