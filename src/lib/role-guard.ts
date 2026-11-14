import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth-guard";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function requireAdmin() {
  const session = await requireAuth();

  if (session.user.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  return session;
}

export async function authorizeAdminAction() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      authorized: false as const,
      error: "UNAUTHENTICATED" as const,
    };
  }

  if (session.user.role !== "ADMIN") {
    return {
      authorized: false as const,
      error: "FORBIDDEN" as const,
    };
  }

  return {
    authorized: true as const,
    session,
  };
}

import { db } from "@/lib/prisma";

export async function authorizeCustomerAction() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      authorized: false as const,
      error: "UNAUTHENTICATED" as const,
    };
  }

  if (session.user.role !== "CUSTOMER") {
    return {
      authorized: false as const,
      error: "FORBIDDEN" as const,
    };
  }

  const customer = await db.customer.findUnique({
    where: {
      user_id: session.user.id,
    },
    select: {
      id: true,
      isActive: true,
    },
  });

  if (!customer) {
    return {
      authorized: false as const,
      error: "CUSTOMER_NOT_FOUND" as const,
    };
  }

  if (!customer.isActive) {
    return {
      authorized: false as const,
      error: "CUSTOMER_INACTIVE" as const,
    };
  }

  return {
    authorized: true as const,
    session,
    customer,
  };
}
