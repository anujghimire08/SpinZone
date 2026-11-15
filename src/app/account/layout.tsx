import AccountSidebar from "@/features/account/components/AccountSidebar";
import { requireAuth } from "@/lib/auth-guard";

type AccountLayoutProps = {
  children: React.ReactNode;
};

const AccountLayout = async ({ children }: AccountLayoutProps) => {
  await requireAuth();

  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 sm:px-8 lg:flex-row lg:gap-10 lg:px-10">
        <aside className="w-full shrink-0 lg:w-64">
          <AccountSidebar />
        </aside>

        <section className="min-w-0 flex-1 border border-zinc-200 bg-white p-5 sm:p-8">
          {children}
        </section>
      </div>
    </main>
  );
};

export default AccountLayout;
