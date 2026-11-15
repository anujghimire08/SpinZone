import ResetPasswordForm from "@/features/account/components/ResetPasswordForm";

interface ResetPasswordPageProps {
  searchParams: Promise<{
    token?: string;
  }>;
}

const ResetPasswordPage = async ({ searchParams }: ResetPasswordPageProps) => {
  const { token } = await searchParams;

  if (!token) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-12">
        <div className="w-full max-w-md space-y-4 border border-red-200 bg-white p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-700">
            Account Security
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
            Invalid Reset Link
          </h1>
          <p className="text-sm leading-6 text-zinc-500">
            The password reset token is missing or invalid. Please request a new
            password reset link.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-12">
      <div className="w-full max-w-md space-y-8 border border-zinc-200 bg-white p-6 sm:p-8">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
            Account Security
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
            Reset Password
          </h1>
          <p className="text-sm leading-6 text-zinc-500">
            Create a new password for your account. Choose a strong password
            that you haven't used before.
          </p>
        </div>

        <ResetPasswordForm token={token} />
      </div>
    </main>
  );
};

export default ResetPasswordPage;
