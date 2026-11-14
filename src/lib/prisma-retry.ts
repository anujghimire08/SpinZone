import { Prisma } from "@/generated/prisma/client";

export const isRetryableTransactionError = (error: unknown) => {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2034"
  );
};
