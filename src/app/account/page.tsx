import Image from "@/features/admin/components/Image";
import SignoutButton from "@/features/auth/components/SignoutButton";
import { requireAuth } from "@/lib/auth-guard";

const Account = async () => {
  const session = await requireAuth();

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4 border-b border-zinc-200 pb-6">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
            My Account
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
            Account Overview
          </h1>
          <p className="text-sm leading-6 text-zinc-500">
            View your account information and manage your profile.
          </p>
        </div>

        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-zinc-200 bg-violet-50 text-lg font-semibold text-violet-700 sm:h-16 sm:w-16">
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt={`${session.user.name}'s profile`}
              fill
              sizes="64px"
              className="object-cover"
            />
          ) : (
            session.user.name?.charAt(0).toUpperCase() || "U"
          )}
        </div>
      </div>

      <section className="space-y-5">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-zinc-950">
            Personal Information
          </h2>
          <p className="text-sm text-zinc-500">Your account details.</p>
        </div>

        <div className="divide-y divide-zinc-200 border border-zinc-200">
          <div className="space-y-1 p-4 sm:p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Full Name
            </p>
            <p className="text-sm font-medium text-zinc-950">
              {session.user.name}
            </p>
          </div>

          <div className="space-y-1 p-4 sm:p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Email Address
            </p>
            <p className="break-all text-sm font-medium text-zinc-950">
              {session.user.email}
            </p>
          </div>
        </div>
      </section>

      <div className="border-t border-zinc-200 pt-6">
        <SignoutButton />
      </div>
    </div>
  );
};

export default Account;
