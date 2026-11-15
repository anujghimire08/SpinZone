import ActiveSessions from "@/features/account/components/ActiveSessions";
import ChangePasswordForm from "@/features/account/components/ChangePasswordForm";
import Link from "next/link";

const SessionPage = () => {
  return (
    <div className="space-y-10">
      <div className="space-y-3 border-b border-zinc-200 pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
          Account Settings
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
          Security
        </h1>
        <p className="text-sm leading-6 text-zinc-500">
          Manage your password and account sessions to keep your account secure.
        </p>
      </div>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-zinc-950">Password</h2>
          <p className="text-sm leading-6 text-zinc-500">
            Update your password to protect your account.
          </p>
        </div>

        <div className="relative space-y-5 border border-zinc-200 bg-white p-5 sm:p-6">
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-violet-700 transition-colors hover:text-violet-800 focus:outline-none focus:underline"
            >
              Forgot password?
            </Link>
          </div>
          <ChangePasswordForm />
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-zinc-950">
            Active Sessions
          </h2>
          <p className="text-sm leading-6 text-zinc-500">
            Review and manage devices currently signed in to your account.
          </p>
        </div>

        <div className="border border-zinc-200 bg-white p-5 sm:p-6">
          <ActiveSessions />
        </div>
      </section>
    </div>
  );
};

export default SessionPage;
