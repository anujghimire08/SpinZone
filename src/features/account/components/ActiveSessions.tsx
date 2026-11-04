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
          setError("Failed to fetch sessions!");
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
      setError("Failed to revoke other sessions!");
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
      setError("Failed to revoke sessions!");
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
      setError("Failed to revoke session!");
    } finally {
      actionInProgress.current = false;
      setLoadingSessionToken(null);
    }
  }, []);

  const reauthenticateHandler = async (password: string) => {
    if (actionInProgress.current) return;

    actionInProgress.current = true;

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
    } finally {
      actionInProgress.current = false;
    }
  };

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading sessions...</p>;
  }

  if (requiresReauthentication) {
    return (
      <ReauthenticateForm
        email={userEmail}
        reauthenticateHandler={reauthenticateHandler}
      />
    );
  }

  if (sessions.length === 0 && error) {
    return (
      <p className="text-sm text-destructive" role="alert">
        {error}
      </p>
    );
  }

  if (sessions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No active sessions found.</p>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <SessionActions
          onRevokeOthers={revokeOtherSessionsHandler}
          onRevokeAll={revokeSessionsHandler}
          loadingAction={loadingAction}
          disabled={loadingAction !== null || loadingSessionToken !== null}
        />
      </div>

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
  );
};

export default ActiveSessions;
