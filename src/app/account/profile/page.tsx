import ChangeEmailForm from "@/features/account/components/ChangeEmailForm";
import DeleteAccountForm from "@/features/account/components/DeleteAccountForm";
import UpdateProfileForm from "@/features/account/components/UpdateProfileForm";
import { requireAuth } from "@/lib/auth-guard";

const ProfilePage = async () => {
  const session = await requireAuth();

  return (
    <>
      <main className="mx-auto w-full max-w-2xl space-y-8 px-6 py-10 sm:px-8">
        <div className="space-y-3 border-b border-zinc-200 pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
            Account Settings
          </p>

          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
            Profile Information
          </h1>

          <p className="max-w-xl text-sm leading-6 text-zinc-500">
            Manage your personal information and keep your account details up to
            date.
          </p>
        </div>

        <UpdateProfileForm initialName={session.user.name} />
      </main>
      <div className="mx-auto w-full max-w-2xl space-y-8 px-6 py-10 sm:px-8">
        <div className="space-y-3 border-b border-zinc-200 pb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
            Change Email Address
          </h1>

          <p className="max-w-xl text-sm leading-6 text-zinc-500">
            Enter your new email address. We'll send you a verification link
            before changing your account email.
          </p>
        </div>

        <ChangeEmailForm />
      </div>

      <div className="mx-auto w-full max-w-2xl space-y-8 px-6 py-10 sm:px-8">
        <div className="space-y-3 border-b border-zinc-200 pb-6">
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
      </div>
    </>
  );
};

export default ProfilePage;
