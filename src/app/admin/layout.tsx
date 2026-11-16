import AdminNavigation from "@/features/admin/components/AdminNavigation";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-[#f7f7f5]">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <header className="border-b border-zinc-200 py-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
            Administration
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Overview of your store performance, orders, inventory, and
            customers.
          </p>
        </header>

        <div className="pt-6">
          <AdminNavigation />
        </div>

        <main className="py-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
