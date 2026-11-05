"use client";

import { getSignup } from "@/features/auth/client/signup";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupSchema, type SignupSchemaType } from "../schemas/auth";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
const SignupForm = () => {
  const router = useRouter();
  const [success, setSuccess] = useState<string | undefined>("");
  const form = useForm<SignupSchemaType>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const {
    register,
    setError,
    reset,
    clearErrors,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = form;

  const submitHandler = async (values: SignupSchemaType) => {
    setSuccess("");
    clearErrors("root");
    try {
      const response = await getSignup(values);
      if (!response.success) {
        setError("root", {
          type: "manual",
          message: response.error,
        });
        return;
      }
      setSuccess("Account created successfully!");
      reset();
      router.push("/signin");
    } catch {
      setError("root", {
        type: "manual",
        message: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <section className="w-full max-w-105 rounded-2xl bg-white p-8 shadow-[0_12px_32px_rgba(15,23,42,0.1)]">
      <h1 className="mb-6 text-[28px] text-gray-900">Create Account</h1>

      <form onSubmit={handleSubmit(submitHandler)} className="grid gap-18px">
        <div className="grid gap-1.75">
          <label htmlFor="name" className="font-semibold text-gray-700">
            Name
          </label>
          <input
            id="name"
            type="text"
            {...register("name")}
            className={inputClassName}
          />
          {errors.name && (
            <p className="m-0 text-red-600">{errors?.name.message}</p>
          )}
        </div>

        <div className="grid gap-1.75">
          <label htmlFor="email" className="font-semibold text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register("email")}
            className={inputClassName}
          />
          {errors.email && (
            <p className="m-0 text-red-600">{errors?.email.message}</p>
          )}
        </div>

        <div className="grid gap-1.75">
          <label htmlFor="password" className="font-semibold text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            {...register("password")}
            className={inputClassName}
          />
          {errors.password && (
            <p className="m-0 text-red-600">{errors?.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`mt-1 rounded-lg px-4 py-3 text-base font-semibold text-white ${
            isSubmitting
              ? "cursor-not-allowed bg-gray-400"
              : "cursor-pointer bg-indigo-600"
          }`}
        >
          {isSubmitting ? "Creating account..." : "Sign Up"}
        </button>
      </form>
      {errors.root && (
        <p className="m-0 text-red-600">{errors?.root.message}</p>
      )}
      {success && <p className="m-0 text-green-600">{success}</p>}
      <br />
      <Link href="/signin">
        <p className="text-center">Have an account?</p>
      </Link>
    </section>
  );
};

export const inputClassName =
  "box-border w-full rounded-lg border border-gray-300 px-3 py-[11px] text-base text-gray-900 outline-indigo-600";

export default SignupForm;
