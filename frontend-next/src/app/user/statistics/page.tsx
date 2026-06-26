"use client";

const STAT_CARDS = [
  {
    icon:  "📋",
    label: "Diagnósticos completados",
    value: "0",
    sub:   "Realiza tu primer diagnóstico",
    color: "#6B5CFF",
    bg:    "rgba(107,92,255,0.12)",
    border:"rgba(107,92,255,0.3)",
  },
  {
    icon:  "📚",
    label: "Cursos iniciados",
    value: "0",
    sub:   "Explora los cursos disponibles",
    color: "#5ACCA4",
    bg:    "rgba(90,204,164,0.12)",
    border:"rgba(90,204,164,0.3)",
  },
  {
    icon:  "✅",
    label: "Cursos completados",
    value: "0",
    sub:   "Completa un curso para registrar progreso",
    color: "#EAA2FC",
    bg:    "rgba(234,162,252,0.12)",
    border:"rgba(234,162,252,0.3)",
  },
  {
    icon:  "📈",
    label: "Promedio de puntuación",
    value: "—",
    sub:   "Disponible tras el primer diagnóstico",
    color: "#E6CA52",
    bg:    "rgba(230,202,82,0.12)",
    border:"rgba(230,202,82,0.3)",
  },
];

const DIMENSIONS = [
  "Autoconocimiento",
  "Autorregulación",
  "Motivación",
  "Empatía",
  "Habilidades Sociales",
  "Conexión Emocional",
];

const card: React.CSSProperties = {
  background:   "rgba(255,255,255,0.08)",
  border:       "1px solid rgba(107,92,255,0.25)",
  borderRadius: 16,
};

export default function StatisticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#F9FAFC" }}>
          Mis Estadísticas
        </h1>
        <p className="text-sm mt-1" style={{ color: "rgba(249,250,252,0.45)" }}>
          Resumen de tu actividad y progreso en la plataforma.
        </p>
      </div>

      {/* ── Summary cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((s) => (
          <div
            key={s.label}
            className="flex flex-col gap-3 p-5 rounded-2xl"
            style={{
              background:   "rgba(255,255,255,0.08)",
              border:       `1px solid ${s.border}`,
              borderRadius: 16,
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: s.bg }}
            >
              {s.icon}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: s.color }}>
                {s.label}
              </p>
              <p className="text-3xl font-bold mt-1" style={{ color: "#F9FAFC" }}>
                {s.value}
              </p>
              <p className="text-xs mt-1" style={{ color: "rgba(249,250,252,0.38)" }}>
                {s.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Dimensions ─────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-bold mb-4" style={{ color: "#F9FAFC" }}>
          Resultados por dimensión
        </h2>
        <div className="p-6 rounded-2xl space-y-4" style={card}>
          {DIMENSIONS.map((dim, i) => {
            const colors = ["#6B5CFF","#5ACCA4","#EAA2FC","#FE654F","#E6CA52","#6B5CFF"];
            const c = colors[i % colors.length];
            return (
              <div key={dim}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium" style={{ color: "rgba(249,250,252,0.75)" }}>
                    {dim}
                  </span>
                  <span className="text-xs" style={{ color: "rgba(249,250,252,0.35)" }}>—</span>
                </div>
                <div className="rounded-full h-2" style={{ background: "rgba(255,255,255,0.07)" }}>
                  <div
                    className="h-2 rounded-full w-0"
                    style={{ background: c }}
                  />
                </div>
              </div>
            );
          })}
          <p
            className="text-xs pt-3"
            style={{
              color:       "rgba(249,250,252,0.35)",
              borderTop:   "1px solid rgba(107,92,255,0.12)",
            }}
          >
            Completa el diagnóstico para ver tus puntuaciones por dimensión.
          </p>
        </div>
      </section>

      {/* ── Activity log ───────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-bold mb-4" style={{ color: "#F9FAFC" }}>
          Actividad reciente
        </h2>
        <div
          className="p-10 flex flex-col items-center justify-center text-center rounded-2xl"
          style={card}
        >
          <div className="text-4xl mb-3">📊</div>
          <p className="text-sm" style={{ color: "rgba(249,250,252,0.4)" }}>
            No hay actividad registrada todavía.
          </p>
        </div>
      </section>
    </div>
  );
}
