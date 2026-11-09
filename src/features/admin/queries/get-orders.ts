import "server-only";

import { db } from "@/lib/prisma";
import { DeliveryStatus, Prisma } from "@/generated/prisma/client";

interface GetOrdersPropsType {
  status?: DeliveryStatus;
  search?: string;
  perPage?: number;
  currentPage?: number;
}

export const getOrders = async ({
  status,
  search,
  perPage = 5,
  currentPage = 1,
}: GetOrdersPropsType) => {
  const where: Prisma.OrderWhereInput = {
    ...(status && { status }),

    ...(search && {
      OR: [
        {
          id: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          customer: {
            is: {
              user: {
                is: {
                  name: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },
            },
          },
        },
        {
          customer: {
            is: {
              user: {
                is: {
                  email: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },
            },
          },
        },
      ],
    }),
  };

  const totalData = await db.order.count({ where });

  const totalPages = Math.ceil(totalData / perPage);

  const page = Math.max(1, Math.min(totalPages || 1, currentPage));

  const skip = (page - 1) * perPage;
  const take = perPage;

  const orders = await db.order.findMany({
    where,
    skip,
    take,
    include: {
      customer: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
      address: true,
      _count: {
        select: {
          order_item: true,
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
    orders,
  };
};

export const getOrderById = async (id: string) => {
  return await db.order.findUnique({
    where: { id },
    include: {
      customer: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
      address: true,
      order_item: {
        include: {
          product: true,
        },
      },
    },
  });
};
