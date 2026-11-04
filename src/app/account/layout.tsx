import AccountSidebar from "@/features/account/components/AccountSidebar";
import { requireAuth } from "@/lib/auth-guard";

type AccountLayoutProps = {
  children: React.ReactNode;
};

const AccountLayout = async ({ children }: AccountLayoutProps) => {
  await requireAuth();

  return (
    <main className="min-h-screen">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 md:flex-row">
        <AccountSidebar />

        <section className="min-w-0 flex-1">{children}</section>
      </div>
    </main>
  );
};

export default AccountLayout;
