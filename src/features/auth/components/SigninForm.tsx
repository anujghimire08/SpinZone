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

const SigninForm = () => {
  const router = useRouter();
  const [success, setSuccess] = useState<string | undefined>("");

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
      className="mx-auto w-full max-w-md space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/50"
    >
      <h1 className="mb-6 text-[28px] text-gray-900">Login on your Account</h1>

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-700"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className={`${inputClassName} w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
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
        <label
          htmlFor="password"
          className="block text-sm font-medium text-slate-700"
        >
          Password
        </label>

        <input
          id="password"
          type="password"
          {...register("password")}
          className={`${inputClassName} w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
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
        <p role="alert" className="text-sm text-red-600">
          {errors.root.message}
        </p>
      )}
      {success && (
        <p role="status" className="text-sm text-green-600">
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
      <Link href="/forgot-password">
        <p className="text-center">Forgot password?</p>
      </Link>
      <br />
      <Link href="/signup">
        <p className="text-center">Don&apos;t have account?</p>
      </Link>
    </form>
  );
};

export default SigninForm;
