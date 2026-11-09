import "server-only";

import { db } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

interface GetCustomersPropsType {
  search?: string;
  isActive?: boolean;
  perPage?: number;
  currentPage?: number;
}
export const getCustomers = async ({
  search,
  isActive,
  perPage = 5,
  currentPage = 1,
}: GetCustomersPropsType = {}) => {
  const where: Prisma.CustomerWhereInput = {
    ...(typeof isActive === "boolean" && { isActive }),

    ...(search && {
      OR: [
        {
          phone_number: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          user: {
            is: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        },
        {
          user: {
            is: {
              email: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        },
      ],
    }),
  };
  const totalData = await db.customer.count({ where });

  const totalPages = Math.ceil(totalData / perPage);

  const page = Math.max(1, Math.min(totalPages || 1, currentPage));

  const skip = (page - 1) * perPage;
  const take = perPage;

  const customers = await db.customer.findMany({
    where,
    skip,
    take,
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          order: true,
          address: true,
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
    customers,
  };
};

export const getCustomerById = async (id: string) => {
  return await db.customer.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          createdAt: true,
        },
      },
      address: true,
      order: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          status: true,
          total_price: true,
          createdAt: true,
        },
      },
      _count: {
        select: {
          order: true,
          address: true,
        },
      },
    },
  });
};
