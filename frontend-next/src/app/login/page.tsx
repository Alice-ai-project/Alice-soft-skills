import type { Metadata } from "next";
import AuthLayout from "@/components/layout/AuthLayout";
import LoginForm from "@/components/forms/LoginForm";

export const metadata: Metadata = {
  title: "Iniciar Sesión · Alice",
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="Bienvenido de nuevo"
      subtitle="Inicia sesión en tu cuenta de Alice"
    >
      <LoginForm />
    </AuthLayout>
  );
}
