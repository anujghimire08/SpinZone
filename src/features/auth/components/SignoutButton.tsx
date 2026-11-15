"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getLogout } from "@/features/auth/client/logout";

const SignoutButton = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const signoutHandler = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await getLogout();

      if (!response.success) {
        setError(response.error || "Failed to sign out. Please try again.");
        return;
      }

      router.replace("/signin");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {error && (
        <p
          role="alert"
          className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={signoutHandler}
        disabled={isLoading}
        className="w-full cursor-pointer bg-red-700 px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isLoading ? "Signing out..." : "Sign Out"}
      </button>
    </div>
  );
};

export default SignoutButton;
