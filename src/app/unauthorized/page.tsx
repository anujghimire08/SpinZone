import Link from "next/link";

const UnauthorizedPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">403 - Forbidden</h1>

      <p>You don't have permission to access this page.</p>

      <Link href="/account">Return to Account</Link>
    </main>
  );
};

export default UnauthorizedPage;
