import ChangeEmailForm from "@/features/account/components/ChangeEmailForm";

const ChangeEmailPage = () => {
  return (
    <main className="mx-auto max-w-lg space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Change Email Address</h1>

        <p className="text-gray-600">
          Enter your new email address. We'll send you a verification link
          before changing your account email.
        </p>
      </div>

      <ChangeEmailForm />
    </main>
  );
};

export default ChangeEmailPage;
