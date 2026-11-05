import { requireAdmin } from "@/lib/role-guard";

const AdminPage = async () => {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
    </main>
  );
};

export default AdminPage;
