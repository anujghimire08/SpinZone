import { requireAdmin } from "@/lib/role-guard";

type AdminLayoutProps = {
  children: React.ReactNode;
};

const AdminLayout = async ({ children }: AdminLayoutProps) => {
  await requireAdmin();

  return <main className="min-h-screen">{children}</main>;
};

export default AdminLayout;
