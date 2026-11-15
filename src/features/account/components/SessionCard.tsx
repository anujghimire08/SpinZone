"use client";

import { getSessions } from "@/features/auth/client/sessions";
import { memo } from "react";

type Session = NonNullable<
  Awaited<ReturnType<typeof getSessions>>["data"]
>[number];

type SessionCardProps = {
  session: Session;
  isCurrentSession: boolean;
  onRevoke: (token: string) => void;
  loading: boolean;
  disabled: boolean;
};

const SessionCard = memo(
  ({
    session,
    isCurrentSession,
    onRevoke,
    loading,
    disabled,
  }: SessionCardProps) => {
    return (
      <div className="space-y-4 border border-zinc-200 bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-1">
            <h3 className="wrap-break-word text-sm font-semibold text-zinc-950">
              {session.userAgent ?? "Unknown device"}
            </h3>
            <p className="text-xs text-zinc-500">
              IP address: {session.ipAddress ?? "Unavailable"}
            </p>
          </div>

          {isCurrentSession && (
            <span className="w-fit shrink-0 border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
              Current device
            </span>
          )}
        </div>

        <div className="border-t border-zinc-100 pt-3">
          <p className="text-xs text-zinc-500">Signed in</p>
          <p className="mt-1 text-sm font-medium text-zinc-700">
            {new Date(session.createdAt).toLocaleString()}
          </p>
        </div>

        {!isCurrentSession && (
          <div className="border-t border-zinc-100 pt-3">
            <button
              type="button"
              disabled={disabled}
              onClick={() => onRevoke(session.token)}
              className="cursor-pointer text-sm font-semibold text-red-700 transition-colors hover:text-red-800 hover:underline focus:outline-none focus:underline disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Signing out..." : "Revoke session"}
            </button>
          </div>
        )}
      </div>
    );
  },
);

export default SessionCard;
