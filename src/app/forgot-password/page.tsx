import ForgotPasswordForm from "@/features/account/components/ForgotPasswordForm";

const ForgotPasswordPage = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-12">
      <div className="w-full max-w-md space-y-8 border border-zinc-200 bg-white p-6 sm:p-8">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
            Account Security
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
            Forgot Password?
          </h1>
          <p className="text-sm leading-6 text-zinc-500">
            Enter your registered email address and we'll send you a link to
            reset your password.
          </p>
        </div>

        <ForgotPasswordForm />
      </div>
    </main>
  );
};

export default ForgotPasswordPage;
