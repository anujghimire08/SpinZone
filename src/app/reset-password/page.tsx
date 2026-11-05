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
      <main className="flex min-h-screen items-center justify-center">
        <div>
          <h1>Invalid Reset Link</h1>
          <p>The password reset token is missing or invalid.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p>Enter your new password below.</p>
        </div>

        <ResetPasswordForm token={token} />
      </div>
    </main>
  );
};

export default ResetPasswordPage;
