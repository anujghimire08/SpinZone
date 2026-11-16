import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth-guard";
import { db } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth-guard";

export async function requireAdmin() {
  const session = await requireAuth();

  if (session.user.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  return session;
}

export async function authorizeAdminAction() {
  const session = await getCurrentSession();

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

export async function authorizeCustomerAction() {
  const session = await getCurrentSession();

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

  const userId = session.user.id;

  if (!userId) {
    console.error("Authenticated session has no user ID.");

    return {
      authorized: false as const,
      error: "INVALID_SESSION" as const,
    };
  }

  console.log("Customer authorization debug:", {
    hasSession: !!session,
    user: session?.user,
    userId: session?.user?.id,
    role: session?.user?.role,
  });

  const customer = await db.customer.findUnique({
    where: {
      user_id: userId,
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
