"use client";

import { useState } from "react";

type ReauthenticateFormProps = {
  email: string;
  reauthenticateHandler: (password: string) => Promise<void>;
};

const ReauthenticateForm = ({
  email,
  reauthenticateHandler,
}: ReauthenticateFormProps) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!password.trim() || loading) return;

    setLoading(true);
    setError(undefined);

    try {
      await reauthenticateHandler(password);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
          Security Verification
        </p>

        <h2 className="text-lg font-semibold tracking-tight text-zinc-950">
          Verify your identity
        </h2>

        <p className="text-sm leading-6 text-zinc-500">
          For security reasons, please confirm your password before managing
          your active sessions.
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="reauth-email"
          className="block text-sm font-medium text-zinc-700"
        >
          Email Address
        </label>

        <input
          id="reauth-email"
          type="email"
          value={email}
          disabled
          className="w-full border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-500 outline-none disabled:cursor-not-allowed"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="reauth-password"
          className="block text-sm font-medium text-zinc-700"
        >
          Password
        </label>

        <input
          id="reauth-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your password"
          autoComplete="current-password"
          required
          disabled={loading}
          className="w-full border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 placeholder:text-zinc-400 outline-none transition focus:border-violet-700 focus:ring-2 focus:ring-violet-700/10 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:opacity-60"
        />
      </div>

      {error && (
        <div
          className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !password.trim()}
        className="w-full cursor-pointer bg-violet-700 px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Verifying..." : "Verify Password"}
      </button>
    </form>
  );
};

export default ReauthenticateForm;
