import { memo } from "react";

type SessionActionsProps = {
  onRevokeOthers: () => void;
  onRevokeAll: () => void;
  loadingAction: "others" | "all" | null;
  disabled: boolean;
};

const SessionActions = memo(
  ({
    onRevokeOthers,
    onRevokeAll,
    loadingAction,
    disabled,
  }: SessionActionsProps) => {
    return (
      <div className="flex flex-wrap gap-2">
        <button
          disabled={disabled}
          onClick={onRevokeOthers}
          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loadingAction === "others"
            ? "Processing..."
            : "Log out all other devices"}
        </button>

        <button
          disabled={disabled}
          onClick={onRevokeAll}
          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loadingAction === "all" ? "Processing..." : "Log out all devices"}
        </button>
      </div>
    );
  },
);

export default SessionActions;
