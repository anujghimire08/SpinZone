import Link from "next/link";

const UnauthorizedPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 py-12">
      <div className="w-full max-w-md space-y-5 border border-zinc-200 bg-white p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-700">
          Access Denied
        </p>

        <h1 className="text-4xl font-bold tracking-tight text-zinc-950">403</h1>

        <h2 className="text-xl font-semibold text-zinc-900">Forbidden</h2>

        <p className="text-sm leading-6 text-zinc-500">
          You don't have permission to access this page. Please return to your
          account.
        </p>

        <Link
          href="/account"
          className="inline-flex w-full items-center justify-center bg-violet-700 px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2"
        >
          Return to Account
        </Link>
      </div>
    </main>
  );
};

export default UnauthorizedPage;
