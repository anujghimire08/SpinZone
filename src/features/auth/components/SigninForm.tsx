"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, type LoginSchemaType } from "../schemas/auth";
import { inputClassName } from "./SignupForm";
import Link from "next/link";
import { getLogin } from "../client/login";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_LOGIN_REDIRECT } from "@/route";
import { googleSignin } from "@/features/auth-client";

const SigninForm = () => {
  const router = useRouter();
  const [success, setSuccess] = useState<string | undefined>("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = form;

  const googleLoginHandler = async () => {
    clearErrors("root");
    setIsGoogleLoading(true);
    try {
      const response = await googleSignin();

      if (response.error) {
        setError("root", {
          type: "manual",
          message:
            response.error.message || "Google login failed. Please try again.",
        });
        setIsGoogleLoading(false);
      }
    } catch (error) {
      console.error("Google login failed:", error);

      setError("root", {
        type: "manual",
        message:
          error instanceof Error
            ? error.message
            : "Google login failed. Check the browser console.",
      });

      setIsGoogleLoading(false);
    }
  };

  const submitHandler = async (values: LoginSchemaType) => {
    setSuccess("");
    clearErrors("root");
    try {
      const response = await getLogin(values);
      if (!response.success) {
        setError("root", {
          type: "manual",
          message: response.error,
        });
        return;
      }
      setSuccess("Account logged in successfully!");
      router.replace(DEFAULT_LOGIN_REDIRECT);
      router.refresh();
    } catch {
      setError("root", {
        type: "manual",
        message: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="mx-auto w-full max-w-md space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40"
    >
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Welcome back
        </h1>
        <p className="text-sm text-slate-500">
          Sign in to continue to your SpinZone account.
        </p>
      </div>

      <button
        type="button"
        onClick={googleLoginHandler}
        disabled={isGoogleLoading || isSubmitting}
        className="flex w-full items-center cursor-pointer justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isGoogleLoading ? (
          <>
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
            Connecting to Google...
          </>
        ) : (
          <>
            <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.73 7.18l7.64 5.93c4.46-4.13 7.13-10.2 7.13-17.13Z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.75-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19Z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.9-5.87l-7.65-5.93c-2.13 1.43-4.87 2.27-8.25 2.27-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
              />
            </svg>
            Continue with Google
          </>
        )}
      </button>

      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
          Or continue with email
        </span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-700"
        >
          Email address
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          {...register("email")}
          className={`${inputClassName} w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p id="email-error" role="alert" className="text-sm text-red-600">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="text-sm font-medium text-slate-700"
          >
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            Forgot password?
          </Link>
        </div>

        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          {...register("password")}
          className={`${inputClassName} w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "password-error" : undefined}
        />
        {errors.password && (
          <p id="password-error" role="alert" className="text-sm text-red-600">
            {errors.password.message}
          </p>
        )}
      </div>

      {errors.root && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          {errors.root.message}
        </p>
      )}

      {success && (
        <p
          role="status"
          className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700"
        >
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting || isGoogleLoading}
        className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>

      <p className="text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-indigo-600 hover:text-indigo-700"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
};

export default SigninForm;
