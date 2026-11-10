import "server-only";

import { db } from "@/lib/prisma";
import { DeliveryStatus } from "@/generated/prisma/client";

export const getMonthlyRevenue = async () => {
  const now = new Date();

  const startDate = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5, 1),
  );

  const orders = await db.order.findMany({
    where: {
      status: DeliveryStatus.DELIVERED,
      createdAt: {
        gte: startDate,
      },
    },
    select: {
      createdAt: true,
      total_price: true,
    },
  });

  const monthlyRevenue = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5 + index, 1),
    );

    return {
      key: `${date.getUTCFullYear()}-${date.getUTCMonth()}`,
      month: date.toLocaleString("en-US", {
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      }),
      revenue: 0,
    };
  });

  for (const order of orders) {
    const key = `${order.createdAt.getUTCFullYear()}-${order.createdAt.getUTCMonth()}`;

    const month = monthlyRevenue.find((item) => item.key === key);

    if (month) {
      month.revenue += Number(order.total_price);
    }
  }

  return monthlyRevenue.map(({ month, revenue }) => ({
    month,
    revenue,
  }));
};
