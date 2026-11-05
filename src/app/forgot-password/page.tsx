import ForgotPasswordForm from "@/features/account/components/ForgotPasswordForm";

const ForgotPasswordPage = () => {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Forgot Password?</h1>
          <p>Enter your email address to receive a password reset link.</p>
        </div>

        <ForgotPasswordForm />
      </div>
    </main>
  );
};

export default ForgotPasswordPage;
