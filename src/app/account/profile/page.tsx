import UpdateProfileForm from "@/features/account/components/UpdateProfileForm";
import { requireAuth } from "@/lib/auth-guard";

const ProfilePage = async () => {
  const session = await requireAuth();

  return (
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
  );
};

export default ProfilePage;
