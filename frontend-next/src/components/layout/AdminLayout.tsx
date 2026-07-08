"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin" },
  { label: "Users",     href: "/admin/users" },
  { label: "Statistics", href: "/admin/statistics" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "linear-gradient(160deg, #0d0628 0%, #0a0418 100%)" }}
    >
      {/* Sidebar */}
      <aside
        className="w-60 flex flex-col shrink-0"
        style={{
          background:  "#0a0418",
          borderRight: "1px solid rgba(124,58,237,0.2)",
        }}
      >
        {/* Logo */}
        <div
          className="px-5 py-5"
          style={{ borderBottom: "1px solid rgba(124,58,237,0.15)" }}
        >
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Alice logo"
              className="w-8 h-8 rounded-lg object-contain"
            />
            <div>
              <p className="text-sm font-bold" style={{ color: "#F9FAFC" }}>
                Alice
              </p>
              <p className="text-[11px]" style={{ color: "#5ACCA4" }}>
                Admin Panel
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center rounded-lg text-sm font-medium transition-colors"
                style={
                  active
                    ? {
                        background:  "rgba(124,58,237,0.2)",
                        color:       "#d8b4fe",
                        borderLeft:  "3px solid #7c3aed",
                        paddingLeft: 12,
                        paddingRight: 12,
                        paddingTop:  8,
                        paddingBottom: 8,
                        boxShadow:   "inset 0 0 20px rgba(124,58,237,0.08)",
                      }
                    : {
                        color:       "rgba(249,250,252,0.5)",
                        borderLeft:  "3px solid transparent",
                        paddingLeft: 12,
                        paddingRight: 12,
                        paddingTop:  8,
                        paddingBottom: 8,
                      }
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          className="px-4 py-4"
          style={{ borderTop: "1px solid rgba(124,58,237,0.15)" }}
        >
          <p
            className="text-xs truncate mb-3"
            style={{ color: "rgba(249,250,252,0.38)" }}
          >
            {user?.email}
          </p>
          <button
            onClick={handleLogout}
            className="text-xs font-medium transition-colors"
            style={{ color: "rgba(254,101,79,0.85)" }}
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
