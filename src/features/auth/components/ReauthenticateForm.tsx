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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Verify your identity</h2>

        <p className="text-sm text-muted-foreground">
          For security reasons, please confirm your password before managing
          your active sessions.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="reauth-email" className="text-sm font-medium">
          Email
        </label>

        <input
          id="reauth-email"
          type="email"
          value={email}
          disabled
          className="w-full rounded-md border bg-muted px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="reauth-password" className="text-sm font-medium">
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
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
        />
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !password.trim()}
        className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
      >
        {loading ? "Verifying..." : "Verify password"}
      </button>
    </form>
  );
};

export default ReauthenticateForm;
