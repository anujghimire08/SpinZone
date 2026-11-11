import { db } from "@/lib/prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { LoginSchema, SignupSchema } from "@/features/auth/schemas/auth";
import { resend } from "./resend";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  baseURL: process.env.BETTER_AUTH_URL,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      requireEmailVerification: true,
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    sendResetPassword: async ({ user, url }) => {
      const { error, data } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: user.email,
        subject: "Reset your password",
        html: `
                <div>
                <h2>Password Reset Request</h2>
                <p>Hello ${user.name},</p>
                <p>We received a request to reset your password.</p>
                <p>
                  <a href="${url}">Reset Password</a>
                </p>
                <p>If you didn't request this, you can ignore this email.</p>
                </div>
        `,
      });
      // remove later
      if (error) {
        console.error("Resend error:", error);
        throw new Error(error.message);
      }
      console.log("Email sent successfully:", data?.id);
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    freshAge: 60 * 60 * 24,
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
    deleteUser: {
      enabled: true,
    },
    changeEmail: {
      enabled: true,
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const { data, error } = await resend.emails.send({
        from: "onboarding@resend.dev",
        // to: user.email, chanage when use custom domain
        to: "contact.anujghimire@gmail.com",
        subject: "Verify Your New Email Address",
        html: `
        <div>
          <h2>Email Change Verification</h2>
          <p>Hello ${user.name},</p>
          <p>We received a request to change your email address.</p>
          <p>
            <a href="${url}">Verify New Email Address</a>
          </p>
          <p>If you didn't request this change, you can ignore this email.</p>
        </div>
      `,
      });

      if (error) {
        console.error("Resend error:", error);
        throw new Error(error.message);
      }

      console.log("Verification email sent:", data?.id);
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const validation = SignupSchema.safeParse(ctx.body);
        if (!validation.success) {
          throw new APIError("BAD_REQUEST", {
            message:
              validation.error.issues[0]?.message ?? "Invalid credentials",
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
      }

      if (ctx.path === "/sign-in/email") {
        const validation = LoginSchema.safeParse(ctx.body);

        if (!validation.success) {
          throw new APIError("BAD_REQUEST", {
            message:
              validation.error.issues[0]?.message ?? "Invalid signup data",
          });
        }

        const user = await db.user.findUnique({
          where: {
            email: validation.data.email,
          },
          select: {
            role: true,
            customer: {
              select: {
                isActive: true,
              },
            },
          },
        });

        if (user?.role === "CUSTOMER" && user.customer?.isActive === false) {
          throw new APIError("FORBIDDEN", {
            message:
              "Your account has been deactivated. Please contact support.",
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
      }
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
