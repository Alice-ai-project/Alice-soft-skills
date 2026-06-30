"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import BackgroundWrapper from "@/components/background/BackgroundWrapper";
import AliceLogoMark from "@/components/ui/AliceLogoMark";

// ─── Types ────────────────────────────────────────────────────────────────────

type IconName =
  | "home" | "clipboard" | "book" | "map" | "chat"
  | "chart" | "user" | "target" | "library";

interface NavItem {
  label: string;
  href:  string;
  icon:  IconName;
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard",      href: "/user",            icon: "home",      exact: true },
  { label: "Diagnóstico",    href: "/user/diagnostic", icon: "clipboard" },
  { label: "Roadmap",        href: "/user/roadmap",    icon: "map"       },
  { label: "Cursos",         href: "/user/courses",    icon: "book"      },
  { label: "Recursos",       href: "/user/resources",  icon: "library"   },
  { label: "Practica con Alice (IA)", href: "/user/chat",       icon: "chat"      },
  { label: "Estadísticas",   href: "/user/statistics", icon: "chart"     },
  { label: "Mi Perfil",      href: "/user/profile",    icon: "user"      },
];

// ─── Icons ────────────────────────────────────────────────────────────────────

function NavIcon({ name }: { name: IconName }) {
  const cls = "w-5 h-5 flex-shrink-0";
  switch (name) {
    case "home": return (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    );
    case "clipboard": return (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    );
    case "book": return (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    );
    case "map": return (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    );
    case "chat": return (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    );
    case "chart": return (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    );
    case "user": return (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    );
    case "target": return (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    );
    case "library": return (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
      </svg>
    );
    default: return null;
  }
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function UserLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  const displayName =
    user?.first_name ? `${user.first_name} ${user.last_name ?? ""}`.trim() : (user?.email ?? "");
  const avatar = (user?.first_name?.[0] ?? user?.email?.[0] ?? "U").toUpperCase();

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <>
      {/* Layer 1 — neural canvas, z-0 */}
      <BackgroundWrapper />

      {/* Layer 2 — depth scrim: enforces strict separation between canvas and UI */}
      <div
        aria-hidden="true"
        style={{
          position:      "fixed",
          inset:         0,
          zIndex:        1,
          pointerEvents: "none",
          background:    "rgba(9,11,28,0.72)",
        }}
      />

      {/* Layer 3 — all UI content, z-2 */}
      <div
        className="min-h-screen flex"
        style={{ position: "relative", zIndex: 2 }}
      >
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 md:hidden"
          style={{ background: "rgba(0,0,0,0.7)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ────────────────────────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 flex flex-col transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "#0E1240",
          borderRight: "1px solid rgba(107,92,255,0.2)",
        }}
      >
        {/* Logo */}
        <div
          className="h-16 flex items-center gap-2.5 px-5 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(107,92,255,0.15)" }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shadow"
            style={{ background: "linear-gradient(135deg,#6B5CFF,#9c85ff)" }}
          >
            <AliceLogoMark />
          </div>
          <div>
            <span className="text-base font-bold leading-none" style={{ color: "#F9FAFC" }}>
              Alice
            </span>
            <p className="text-[10px] font-medium leading-none mt-0.5" style={{ color: "#5ACCA4" }}>
              Soft Skills
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
                style={
                  active
                    ? {
                        background: "rgba(107,92,255,0.2)",
                        color: "#c4b8ff",
                        borderLeft: "3px solid #6B5CFF",
                        paddingLeft: 12,
                        paddingRight: 12,
                        boxShadow: "inset 0 0 20px rgba(107,92,255,0.08)",
                      }
                    : {
                        color: "rgba(249,250,252,0.5)",
                        borderLeft: "3px solid transparent",
                        paddingLeft: 12,
                        paddingRight: 12,
                      }
                }
              >
                <NavIcon name={item.icon} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User + logout */}
        <div
          className="p-4 flex-shrink-0"
          style={{ borderTop: "1px solid rgba(107,92,255,0.12)" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(107,92,255,0.25)" }}
            >
              <span className="text-sm font-bold" style={{ color: "#c4b8ff" }}>
                {avatar}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate leading-tight" style={{ color: "#F9FAFC" }}>
                {displayName}
              </p>
              {user?.first_name && (
                <p className="text-xs truncate" style={{ color: "rgba(249,250,252,0.38)" }}>
                  {user.email}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg transition-all font-medium hover:bg-[rgba(254,101,79,0.12)]"
            style={{ color: "rgba(254,101,79,0.85)" }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header
          className="h-16 flex items-center px-4 gap-4 md:hidden flex-shrink-0"
          style={{
            background: "#0E1240",
            borderBottom: "1px solid rgba(107,92,255,0.2)",
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg transition-colors hover:bg-[rgba(107,92,255,0.12)]"
            style={{ color: "rgba(249,250,252,0.65)" }}
            aria-label="Abrir menú"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#6B5CFF,#9c85ff)" }}
            >
              <AliceLogoMark />
            </div>
            <span className="text-base font-bold" style={{ color: "#F9FAFC" }}>Alice</span>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
    </>
  );
}
