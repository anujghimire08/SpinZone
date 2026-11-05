import DeleteAccountForm from "@/features/account/components/DeleteAccountForm";

const DeleteAccountPage = () => {
  return (
    <main className="mx-auto max-w-lg space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Delete Account</h1>
        <p>
          Permanently delete your account and associated customer data. Your
          order history will be preserved.
        </p>
      </div>

      <DeleteAccountForm />
    </main>
  );
};

export default DeleteAccountPage;
