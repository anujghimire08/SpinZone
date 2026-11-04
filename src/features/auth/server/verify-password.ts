"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const verifyPassword = async (password: string) => {
  try {
    await auth.api.verifyPassword({
      body: { password },
      headers: await headers(),
    });

    return { success: true as const };
  } catch {
    return {
      success: false as const,
      error: "Incorrect password. Please try again.",
    };
  }
};
