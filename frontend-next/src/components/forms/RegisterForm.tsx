"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Spinner } from "@heroui/react";
import { registerUser } from "@/services/authService";
import { ApiClientError } from "@/services/apiClient";
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmEmail,
  validateConfirmPassword,
} from "@/utils/validations";

type FormState = "idle" | "submitting" | "success";
type FieldErrors = Record<string, string>;

export default function RegisterForm() {
  const [firstName,       setFirstName]       = useState("");
  const [lastName,        setLastName]        = useState("");
  const [email,           setEmail]           = useState("");
  const [confirmEmail,    setConfirmEmail]    = useState("");
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors,          setErrors]          = useState<FieldErrors>({});
  const [globalError,     setGlobalError]     = useState<string | null>(null);
  const [formState,       setFormState]       = useState<FormState>("idle");

  function validate(): boolean {
    const errs: FieldErrors = {};

    const fnErr = validateName(firstName, "First name");
    if (fnErr) errs.firstName = fnErr;

    const lnErr = validateName(lastName, "Last name");
    if (lnErr) errs.lastName = lnErr;

    const emailErr = validateEmail(email);
    if (emailErr) errs.email = emailErr;

    const cEmailErr = validateConfirmEmail(email, confirmEmail);
    if (cEmailErr) errs.confirmEmail = cEmailErr;

    const pwErr = validatePassword(password);
    if (pwErr) errs.password = pwErr;

    const cPwErr = validateConfirmPassword(password, confirmPassword);
    if (cPwErr) errs.confirmPassword = cPwErr;

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setGlobalError(null);
    if (!validate()) return;

    setFormState("submitting");
    try {
      await registerUser({
        email,
        password,
        first_name: firstName,
        last_name:  lastName,
      });
      setFormState("success");
    } catch (err) {
      setFormState("idle");
      if (err instanceof ApiClientError) {
        const isDuplicate =
          err.status === 422 ||
          err.status === 400 ||
          err.message.toLowerCase().includes("already") ||
          err.message.toLowerCase().includes("duplicate") ||
          err.message.toLowerCase().includes("registered");

        setGlobalError(
          isDuplicate
            ? "This email is already registered. Please log in or use another email."
            : err.message,
        );
      } else {
        setGlobalError("An unexpected error occurred. Please try again.");
      }
    }
  }

  if (formState === "success") {
    return (
      <div className="py-4 text-center space-y-5">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
          style={{ background: "rgba(90,204,164,0.18)", border: "1px solid rgba(90,204,164,0.35)" }}
        >
          <svg
            className="w-8 h-8"
            style={{ color: "#5ACCA4" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold" style={{ color: "#F9FAFC" }}>
            Account created!
          </h2>
          <p className="text-sm mt-1" style={{ color: "rgba(249,250,252,0.5)" }}>
            User registered successfully. You can now sign in to your account.
          </p>
        </div>
        <Link
          href="/login"
          className="inline-block w-full text-center px-4 py-2.5 rounded-lg text-sm font-semibold transition-opacity"
          style={{ background: "#6B5CFF", color: "#F9FAFC" }}
        >
          Go to Login
        </Link>
      </div>
    );
  }

  const isSubmitting = formState === "submitting";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {globalError && (
        <div
          role="alert"
          className="px-4 py-3 rounded-lg text-sm"
          style={{
            background: "rgba(254,101,79,0.1)",
            border:     "1px solid rgba(254,101,79,0.3)",
            color:      "#FE654F",
          }}
        >
          {globalError}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Field label="First Name" error={errors.firstName}>
          <input
            type="text"
            maxLength={50}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="John"
            disabled={isSubmitting}
            className={inputCls(!!errors.firstName)}
          />
        </Field>
        <Field label="Last Name" error={errors.lastName}>
          <input
            type="text"
            maxLength={50}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Doe"
            disabled={isSubmitting}
            className={inputCls(!!errors.lastName)}
          />
        </Field>
      </div>

      <Field label="Email" error={errors.email}>
        <input
          type="email"
          maxLength={50}
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          disabled={isSubmitting}
          className={inputCls(!!errors.email)}
        />
      </Field>

      <Field label="Confirm Email" error={errors.confirmEmail}>
        <input
          type="email"
          maxLength={50}
          autoComplete="off"
          value={confirmEmail}
          onChange={(e) => setConfirmEmail(e.target.value)}
          placeholder="you@example.com"
          disabled={isSubmitting}
          className={inputCls(!!errors.confirmEmail)}
        />
      </Field>

      <Field label="Password" error={errors.password}>
        <input
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min. 8 characters"
          disabled={isSubmitting}
          className={inputCls(!!errors.password)}
        />
      </Field>

      <Field label="Confirm Password" error={errors.confirmPassword}>
        <input
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          disabled={isSubmitting}
          className={inputCls(!!errors.confirmPassword)}
        />
      </Field>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 rounded-lg text-sm font-semibold mt-2 transition-opacity disabled:opacity-50"
        style={{ background: "#6B5CFF", color: "#F9FAFC" }}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <Spinner size="sm" /> Creating account...
          </span>
        ) : (
          "Create Account"
        )}
      </button>

      <p className="text-center text-sm" style={{ color: "rgba(249,250,252,0.5)" }}>
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold"
          style={{ color: "#6B5CFF" }}
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label
        className="block text-xs font-semibold uppercase tracking-wide"
        style={{ color: "rgba(249,250,252,0.55)" }}
      >
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="text-xs" style={{ color: "#FE654F" }}>
          {error}
        </p>
      )}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return [
    "w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-colors",
    "text-[#F9FAFC] placeholder-[rgba(249,250,252,0.28)]",
    "focus:ring-1",
    "disabled:opacity-40 disabled:cursor-not-allowed",
    hasError
      ? "bg-[rgba(254,101,79,0.08)] border border-[rgba(254,101,79,0.4)] focus:ring-[rgba(254,101,79,0.3)] focus:border-[rgba(254,101,79,0.5)]"
      : "bg-[rgba(107,92,255,0.07)] border border-[rgba(107,92,255,0.22)] focus:ring-[rgba(107,92,255,0.2)] focus:border-[rgba(107,92,255,0.5)]",
  ].join(" ");
}
