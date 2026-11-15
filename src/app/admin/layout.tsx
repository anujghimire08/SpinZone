import { requireAdmin } from "@/lib/role-guard";

type AdminLayoutProps = {
  children: React.ReactNode;
};

const AdminLayout = async ({ children }: AdminLayoutProps) => {
  await requireAdmin();

  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {children}
      </div>
    </main>
  );
};

export default AdminLayout;
