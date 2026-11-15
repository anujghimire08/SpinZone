import DeleteAccountForm from "@/features/account/components/DeleteAccountForm";

const DeleteAccountPage = () => {
  return (
    <main className="mx-auto w-full max-w-2xl space-y-8 px-6 py-10 sm:px-8">
      <div className="space-y-3 border-b border-zinc-200 pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-700">
          Account Security
        </p>

        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
          Delete Account
        </h1>

        <p className="max-w-xl text-sm leading-6 text-zinc-500">
          Permanently delete your account and associated customer data. Your
          order history will be preserved.
        </p>
      </div>

      <div className="border border-red-200 bg-red-50 p-4">
        <p className="text-sm font-semibold text-red-800">
          This action cannot be undone.
        </p>
        <p className="mt-1 text-sm leading-6 text-red-700">
          Make sure you understand the consequences before deleting your
          account.
        </p>
      </div>

      <DeleteAccountForm />
    </main>
  );
};

export default DeleteAccountPage;
