import type { ReactNode } from "react";
import AliceLogoMark from "@/components/ui/AliceLogoMark";

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
          "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(107,92,255,0.18), transparent 60%)",
          "#050816",
        ].join(", "),
      }}
    >
      <div className="w-full max-w-md">
        {/* Logo + heading */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 shadow-lg"
            style={{ background: "linear-gradient(135deg,#6B5CFF,#9c85ff)" }}
          >
            <AliceLogoMark />
          </div>
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
            border: "1px solid rgba(107,92,255,0.2)",
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
