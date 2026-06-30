"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Spinner } from "@heroui/react";
import { useAuth } from "@/contexts/AuthContext";
import { loginUser } from "@/services/authService";
import { ApiClientError } from "@/services/apiClient";
import { validateEmail } from "@/utils/validations";
import type { StoredSession } from "@/types/auth";

type FieldErrors = Record<string, string>;

export default function LoginForm() {
  const { setSession } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): boolean {
    const errs: FieldErrors = {};
    const emailErr = validateEmail(email);
    if (emailErr) errs.email = emailErr;
    if (!password) errs.password = "La contraseña es requerida.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setGlobalError(null);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const session = await loginUser({ email, password });
      if (!session.access_token) {
        throw new ApiClientError(
          "Se requiere confirmación de correo electrónico antes de iniciar sesión.",
          401,
          "email_not_confirmed",
        );
      }

      const stored: StoredSession = {
        access_token:  session.access_token,
        refresh_token: session.refresh_token ?? "",
        user:          session.user,
      };
      setSession(stored);

      const role = session.user.role;
      router.push(role === "admin" ? "/admin" : "/user");
    } catch (err) {
      if (err instanceof ApiClientError) {
        setGlobalError(err.message);
      } else {
        setGlobalError("Ocurrió un error inesperado. Por favor, intenta de nuevo.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
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

      <Field label="Correo electrónico" error={errors.email}>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@ejemplo.com"
          disabled={isSubmitting}
          className={inputCls(!!errors.email)}
        />
      </Field>

      <Field label="Contraseña" error={errors.password}>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          disabled={isSubmitting}
          className={inputCls(!!errors.password)}
        />
      </Field>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 rounded-lg text-sm font-semibold transition-opacity disabled:opacity-50"
        style={{ background: "#6B5CFF", color: "#F9FAFC" }}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <Spinner size="sm" /> Iniciando sesión...
          </span>
        ) : (
          "Iniciar Sesión"
        )}
      </button>

      <p className="text-center">
        <Link
          href="/"
          className="text-xs transition-colors"
          style={{ color: "rgba(249,250,252,0.3)" }}
        >
          ← Volver al inicio
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
