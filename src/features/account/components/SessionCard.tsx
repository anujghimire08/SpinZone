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
      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <p className="font-medium">{session.userAgent ?? "Unknown device"}</p>

          {isCurrentSession && (
            <span className="rounded-full bg-green-100 w-25 px-2 py-1 text-xs text-green-700">
              Current device
            </span>
          )}
        </div>

        <p className="text-sm text-muted-foreground">
          IP address: {session.ipAddress ?? "Unavailable"}
        </p>

        <p className="text-sm text-muted-foreground">
          Signed in: {new Date(session.createdAt).toLocaleString()}
        </p>

        {!isCurrentSession && (
          <button
            disabled={disabled}
            onClick={() => onRevoke(session.token)}
            className={`mt-3 cursor-pointer text-sm font-medium hover:underline ${loading ? "text-red-50 " : "text-red-400"}`}
          >
            {loading ? "logging out.." : "Logout"}
          </button>
        )}
      </div>
    );
  },
);

export default SessionCard;
