import ActiveSessions from "@/features/account/components/ActiveSessions";
import ChangePasswordForm from "@/features/auth/components/ChangePasswordForm";

const SecurityPage = () => {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold">Security</h1>
        <p className="text-sm text-muted-foreground">
          Manage your password and account sessions.
        </p>
      </div>

      {/* Password Section */}
      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-medium">Password</h2>
          <p className="text-sm text-muted-foreground">
            Manage your account password.
          </p>
        </div>

        <div className="rounded-lg border border-dashed p-4">
          <ChangePasswordForm />
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-medium">Active sessions</h2>
          <p className="text-sm text-muted-foreground">
            Manage devices currently signed in to your account.
          </p>
        </div>

        <div className="rounded-lg border border-dashed p-4">
          <ActiveSessions />
        </div>
      </section>
    </div>
  );
};

export default SecurityPage;
