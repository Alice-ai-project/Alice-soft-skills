"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProfile } from "@/services/userService";
import type { UserProfile } from "@/types/user";

const card: React.CSSProperties = {
  background:   "rgba(255,255,255,0.08)",
  border:       "1px solid rgba(107,92,255,0.25)",
  borderRadius: 16,
};

export default function ProfilePage() {
  const { session, user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session && user) {
      setLoading(true);
      getUserProfile(user.user_id, session.access_token)
        .then(setProfile)
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [session, user]);

  const displayName = user?.first_name
    ? `${user.first_name} ${user.last_name ?? ""}`.trim()
    : null;

  const avatar = (user?.first_name?.[0] ?? user?.email?.[0] ?? "U").toUpperCase();

  const infoRows = [
    { label: "Email",             value: user?.email },
    { label: "Nombre",            value: displayName ?? "—" },
    { label: "Rol",               value: user?.role ?? "estudiante" },
    { label: "ID de usuario",     value: user?.user_id },
    {
      label: "Fecha de registro",
      value: profile?.created_at
        ? new Date(profile.created_at).toLocaleDateString("es-CO", {
            year: "numeric", month: "long", day: "numeric",
          })
        : "—",
    },
  ];

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#F9FAFC" }}>
          Mi Perfil
        </h1>
        <p className="text-sm mt-1" style={{ color: "rgba(249,250,252,0.45)" }}>
          Información de tu cuenta en Alice.
        </p>
      </div>

      {/* ── Avatar card ─────────────────────────────────────────────────────── */}
      <div className="p-6 rounded-2xl flex items-center gap-5" style={card}>
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg,#6B5CFF,#9c85ff)" }}
        >
          <span className="text-white text-2xl font-bold">{avatar}</span>
        </div>
        <div>
          <p className="text-lg font-bold" style={{ color: "#F9FAFC" }}>
            {displayName ?? user?.email}
          </p>
          {displayName && (
            <p className="text-sm" style={{ color: "rgba(249,250,252,0.45)" }}>
              {user?.email}
            </p>
          )}
          <span
            className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize"
            style={{
              background: "rgba(107,92,255,0.2)",
              color:      "#c4b8ff",
              border:     "1px solid rgba(107,92,255,0.35)",
            }}
          >
            {user?.role ?? "estudiante"}
          </span>
        </div>
      </div>

      {/* ── Info rows ────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl overflow-hidden" style={card}>
        {infoRows.map((row, i) => (
          <div
            key={row.label}
            className="flex items-start justify-between gap-4 px-5 py-4"
            style={
              i !== 0
                ? { borderTop: "1px solid rgba(107,92,255,0.1)" }
                : undefined
            }
          >
            <span
              className="text-xs uppercase tracking-wide font-semibold w-36 flex-shrink-0 pt-0.5"
              style={{ color: "rgba(249,250,252,0.38)" }}
            >
              {row.label}
            </span>
            <span
              className="text-sm font-medium text-right break-all"
              style={{ color: "rgba(249,250,252,0.8)" }}
            >
              {loading && row.label === "Fecha de registro" ? (
                <span style={{ color: "rgba(249,250,252,0.3)" }}>Cargando…</span>
              ) : (
                row.value ?? "—"
              )}
            </span>
          </div>
        ))}
      </div>

      {/* ── Coming soon notice ───────────────────────────────────────────────── */}
      <div
        className="p-4 rounded-2xl"
        style={{
          background: "rgba(230,202,82,0.08)",
          border:     "1px solid rgba(230,202,82,0.25)",
          borderRadius: 16,
        }}
      >
        <p className="text-sm font-semibold" style={{ color: "#E6CA52" }}>
          Edición de perfil
        </p>
        <p className="text-xs mt-1" style={{ color: "rgba(249,250,252,0.5)" }}>
          La actualización de nombre, foto y objetivos de aprendizaje estará disponible próximamente.
        </p>
      </div>

      {/* ── Actions ──────────────────────────────────────────────────────────── */}
      <div className="flex gap-3">
        <Link
          href="/user/diagnostic"
          className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
          style={{ background: "#6B5CFF", color: "#F9FAFC" }}
        >
          Realizar diagnóstico
        </Link>
        <Link
          href="/user"
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={{
            background: "rgba(107,92,255,0.1)",
            border:     "1px solid rgba(107,92,255,0.25)",
            color:      "rgba(249,250,252,0.75)",
          }}
        >
          Ir al dashboard
        </Link>
      </div>
    </div>
  );
}
