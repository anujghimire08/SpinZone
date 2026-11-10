import "server-only";

import { db } from "@/lib/prisma";
import { DeliveryStatus } from "@/generated/prisma/client";

export const getDashboardStats = async () => {
  const [
    totalOrders,
    totalCustomers,
    totalProducts,
    pendingOrders,
    revenue,
    lowStockProducts,
    recentOrders,
    lowStockItems,
    ordersByStatus,
    recentCustomers,
  ] = await Promise.all([
    db.order.count(),

    db.customer.count(),

    db.product.count({
      where: { isActive: true },
    }),

    db.order.count({
      where: { status: DeliveryStatus.PENDING },
    }),

    db.order.aggregate({
      where: { status: DeliveryStatus.DELIVERED },
      _sum: { total_price: true },
    }),

    db.inventory.count({
      where: {
        quantity: {
          lte: 5,
        },
        product: {
          isActive: true,
        },
      },
    }),

    db.order.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
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
        _count: {
          select: {
            order_item: true,
          },
        },
      },
    }),

    db.inventory.findMany({
      where: {
        quantity: {
          lte: 5,
        },
        product: {
          isActive: true,
        },
      },
      take: 5,
      orderBy: {
        quantity: "asc",
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),

    db.order.groupBy({
      by: ["status"],
      _count: {
        _all: true,
      },
    }),

    db.customer.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    }),
  ]);

  return {
    totalOrders,
    totalCustomers,
    totalProducts,
    pendingOrders,
    totalRevenue: Number(revenue._sum.total_price ?? 0),
    lowStockProducts,
    recentOrders,
    lowStockItems,
    ordersByStatus,
    recentCustomers,
  };
};
