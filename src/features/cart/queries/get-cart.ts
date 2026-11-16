import "server-only";

import { db } from "@/lib/prisma";
import { authorizeCustomerAction } from "@/lib/role-guard";

export const getCart = async () => {
  const authorization = await authorizeCustomerAction();

  if (!authorization.authorized) {
    return {
      success: false as const,
      error: authorization.error ?? "Unauthorized access.",
    };
  }

  const customerId = authorization.customer.id;

  try {
    const cart = await db.cart.findUnique({
      where: {
        customer_id: customerId,
      },
      include: {
        cart_item: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                img: true,
                price: true,
                discount_percent: true,
                isActive: true,
                inventory: {
                  select: {
                    quantity: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      return {
        success: true as const,
        data: {
          items: [],
          totalItems: 0,
          subtotal: 0,
        },
      };
    }

    const items = cart.cart_item.map((item) => {
      const price = Number(item.product.price);

      const discountPercent = Number(item.product.discount_percent ?? 0);

      const discountedPrice = price - (price * discountPercent) / 100;

      return {
        id: item.id,
        productId: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        img: item.product.img,
        quantity: item.quantity,
        price: discountedPrice,
        originalPrice: price,
        isActive: item.product.isActive,
        availableStock: item.product.inventory?.quantity ?? 0,
        itemSubtotal: discountedPrice * item.quantity,
      };
    });

    const totalItems = items.reduce((total, item) => total + item.quantity, 0);

    const subtotal = items.reduce(
      (total, item) => total + item.itemSubtotal,
      0,
    );

    return {
      success: true as const,
      data: {
        items,
        totalItems,
        subtotal,
        cart_id: cart.id,
      },
    };
  } catch (error) {
    console.error("Get cart error:", error);

    return {
      success: false as const,
      error: "Unable to retrieve your cart.",
    };
  }
};
