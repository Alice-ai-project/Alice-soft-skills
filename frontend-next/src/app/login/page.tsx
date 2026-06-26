import type { Metadata } from "next";
import AuthLayout from "@/components/layout/AuthLayout";
import LoginForm from "@/components/forms/LoginForm";

export const metadata: Metadata = {
  title: "Sign In · Alice",
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your Alice account"
    >
      <LoginForm />
    </AuthLayout>
  );
}
