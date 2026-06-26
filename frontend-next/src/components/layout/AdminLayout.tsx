"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AliceLogoMark from "@/components/ui/AliceLogoMark";

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
      style={{ background: "linear-gradient(160deg, #181E4B 0%, #111540 100%)" }}
    >
      {/* Sidebar */}
      <aside
        className="w-60 flex flex-col shrink-0"
        style={{
          background:  "#0E1240",
          borderRight: "1px solid rgba(107,92,255,0.2)",
        }}
      >
        {/* Logo */}
        <div
          className="px-5 py-5"
          style={{ borderBottom: "1px solid rgba(107,92,255,0.15)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#6B5CFF,#9c85ff)" }}
            >
              <AliceLogoMark />
            </div>
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
                        background:  "rgba(107,92,255,0.2)",
                        color:       "#c4b8ff",
                        borderLeft:  "3px solid #6B5CFF",
                        paddingLeft: 12,
                        paddingRight: 12,
                        paddingTop:  8,
                        paddingBottom: 8,
                        boxShadow:   "inset 0 0 20px rgba(107,92,255,0.08)",
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
          style={{ borderTop: "1px solid rgba(107,92,255,0.15)" }}
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
