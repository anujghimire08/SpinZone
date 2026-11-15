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
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          disabled={disabled}
          onClick={onRevokeOthers}
          className="cursor-pointer border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-950 focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loadingAction === "others"
            ? "Processing..."
            : "Log out all other devices"}
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={onRevokeAll}
          className="cursor-pointer border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loadingAction === "all" ? "Processing..." : "Log out all devices"}
        </button>
      </div>
    );
  },
);

SessionActions.displayName = "SessionActions";

export default SessionActions;
