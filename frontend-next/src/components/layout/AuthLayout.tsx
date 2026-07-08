import type { ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: [
          "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(124,58,237,0.22), transparent 60%)",
          "#060311",
        ].join(", "),
      }}
    >
      <div className="w-full max-w-md">
        {/* Logo + heading */}
        <div className="text-center mb-8">
          <img
            src="/logo.png"
            alt="Alice logo"
            className="mx-auto mb-5 w-20 h-20 object-contain"
          />
          <h1 className="text-2xl font-bold" style={{ color: "#F9FAFC" }}>
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-sm" style={{ color: "rgba(249,250,252,0.5)" }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-7"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(124,58,237,0.25)",
            backdropFilter: "blur(12px)",
          }}
        >
          {children}
        </div>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs" style={{ color: "rgba(249,250,252,0.25)" }}>
          © {new Date().getFullYear()} Alice Soft Skills
        </p>
      </div>
    </div>
  );
}
