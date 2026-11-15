"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  getSessions,
  getCurrentSession,
  revokeOtherSessions,
  revokeSession,
  revokeSessions,
} from "@/features/auth/client/sessions";
import { reauthenticate } from "@/features/auth/client/reauthenticate";
import SessionCard from "@/features/account/components/SessionCard";
import SessionActions from "@/features/account/components/SessionActions";
import ReauthenticateForm from "@/features/auth/components/ReauthenticateForm";

type SessionList = NonNullable<Awaited<ReturnType<typeof getSessions>>["data"]>;

const ActiveSessions = () => {
  const router = useRouter();
  const actionInProgress = useRef(false);

  const [sessions, setSessions] = useState<SessionList>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState<"others" | "all" | null>(
    null,
  );
  const [error, setError] = useState<string>();
  const [loadingSessionToken, setLoadingSessionToken] = useState<string | null>(
    null,
  );
  const [requiresReauthentication, setRequiresReauthentication] =
    useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [currentSessionToken, setCurrentSessionToken] = useState<string | null>(
    null,
  );

  useEffect(() => {
    let ignore = false;

    const fetchSessions = async () => {
      try {
        const [sessionsResponse, currentSessionResponse] = await Promise.all([
          getSessions(),
          getCurrentSession(),
        ]);

        if (ignore) return;

        if (currentSessionResponse.error) {
          setError(currentSessionResponse.error.message);
          return;
        }

        const currentSession = currentSessionResponse.data;

        if (!currentSession) {
          setError("No authenticated session found.");
          return;
        }

        setUserEmail(currentSession.user.email);
        setCurrentSessionToken(currentSession.session.token);

        if (sessionsResponse.error) {
          if (sessionsResponse.error.code === "SESSION_NOT_FRESH") {
            setRequiresReauthentication(true);
          } else {
            setError(sessionsResponse.error.message);
          }

          return;
        }

        setSessions(sessionsResponse.data ?? []);
      } catch {
        if (!ignore) {
          setError("Failed to fetch sessions.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchSessions();

    return () => {
      ignore = true;
    };
  }, []);

  const revokeOtherSessionsHandler = useCallback(async () => {
    if (actionInProgress.current) return;

    actionInProgress.current = true;
    setLoadingAction("others");
    setError(undefined);

    try {
      const { error } = await revokeOtherSessions();

      if (error) {
        setError(error.message);
        return;
      }

      setSessions((previousSessions) =>
        previousSessions.filter(
          (session) => session.token === currentSessionToken,
        ),
      );
    } catch {
      setError("Failed to revoke other sessions.");
    } finally {
      actionInProgress.current = false;
      setLoadingAction(null);
    }
  }, [currentSessionToken]);

  const revokeSessionsHandler = useCallback(async () => {
    if (actionInProgress.current) return;

    actionInProgress.current = true;
    setLoadingAction("all");
    setError(undefined);

    try {
      const { error } = await revokeSessions();

      if (error) {
        setError(error.message);
        return;
      }

      setSessions([]);
      router.replace("/signin");
    } catch {
      setError("Failed to revoke sessions.");
    } finally {
      actionInProgress.current = false;
      setLoadingAction(null);
    }
  }, [router]);

  const revokeHandler = useCallback(async (token: string) => {
    if (actionInProgress.current) return;

    actionInProgress.current = true;
    setLoadingSessionToken(token);
    setLoadingAction(null);
    setError(undefined);

    try {
      const { error } = await revokeSession(token);

      if (error) {
        setError(error.message);
        return;
      }

      setSessions((previousSessions) =>
        previousSessions.filter((session) => session.token !== token),
      );
    } catch {
      setError("Failed to revoke session.");
    } finally {
      actionInProgress.current = false;
      setLoadingSessionToken(null);
    }
  }, []);

  const reauthenticateHandler = async (password: string) => {
    if (actionInProgress.current) return;

    actionInProgress.current = true;
    setError(undefined);

    try {
      const result = await reauthenticate(userEmail, password);

      if (!result.success) {
        throw new Error(result.error);
      }

      const [sessionsResponse, currentSessionResponse] = await Promise.all([
        getSessions(),
        getCurrentSession(),
      ]);

      if (currentSessionResponse.error) {
        throw new Error(currentSessionResponse.error.message);
      }

      if (sessionsResponse.error) {
        throw new Error(sessionsResponse.error.message);
      }

      if (!currentSessionResponse.data) {
        throw new Error("Unable to retrieve the current session.");
      }

      setSessions(sessionsResponse.data ?? []);
      setCurrentSessionToken(currentSessionResponse.data.session.token);
      setRequiresReauthentication(false);
      setError(undefined);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Reauthentication failed. Please try again.",
      );
    } finally {
      actionInProgress.current = false;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-2" role="status">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-200 border-t-violet-700" />
        <p className="text-sm text-zinc-500">Loading sessions...</p>
      </div>
    );
  }

  if (requiresReauthentication) {
    return (
      <div className="space-y-5">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-zinc-950">
            Verify your identity
          </h3>
          <p className="text-sm leading-6 text-zinc-500">
            For your security, confirm your password before managing active
            sessions.
          </p>
        </div>

        {error && (
          <p
            className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {error}
          </p>
        )}

        <ReauthenticateForm
          email={userEmail}
          reauthenticateHandler={reauthenticateHandler}
        />
      </div>
    );
  }

  if (sessions.length === 0 && error) {
    return (
      <p
        className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        role="alert"
      >
        {error}
      </p>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="space-y-2 py-2">
        <h3 className="text-sm font-semibold text-zinc-950">
          No active sessions
        </h3>
        <p className="text-sm leading-6 text-zinc-500">
          There are currently no active sessions to display.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-zinc-950">
            {sessions.length} {sessions.length === 1 ? "session" : "sessions"}
          </p>
          <p className="text-xs text-zinc-500">
            Devices currently signed in to your account.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <SessionActions
            onRevokeOthers={revokeOtherSessionsHandler}
            onRevokeAll={revokeSessionsHandler}
            loadingAction={loadingAction}
            disabled={loadingAction !== null || loadingSessionToken !== null}
          />
        </div>
      </div>

      {error && (
        <p
          className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {error}
        </p>
      )}

      <div className="space-y-3">
        {sessions.map((session) => (
          <SessionCard
            key={session.token}
            session={session}
            isCurrentSession={session.token === currentSessionToken}
            onRevoke={revokeHandler}
            loading={loadingSessionToken === session.token}
            disabled={loadingAction !== null || loadingSessionToken !== null}
          />
        ))}
      </div>
    </div>
  );
};

export default ActiveSessions;
