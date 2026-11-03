import { db } from "@/lib/prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { SignupSchema } from "@/features/auth/schemas/auth";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: ["ADMIN", "CUSTOMER"],
        required: false,
        defaultValue: "CUSTOMER",
        input: false,
      },
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-up/email") {
        return;
      }
      const validation = SignupSchema.safeParse(ctx.body);
      if (!validation.success) {
        throw new APIError("BAD_REQUEST", {
          message: validation.error.issues[0]?.message ?? "Invalid credentials",
        });
      }
      return {
        context: {
          ...ctx,
          body: {
            ...ctx.body,
            ...validation.data,
          },
        },
      };
    }),
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await db.customer.upsert({
            where: {
              user_id: user.id,
            },
            update: {},
            create: {
              user_id: user.id,
            },
          });
        },
      },
    },
  },
  plugins: [nextCookies()],
});
