"use client";

const GOALS = [
  {
    title:   "Completar 3 cursos este mes",
    current: 1,
    target:  3,
    unit:    "cursos",
    icon:    "📚",
    color:   "#6B5CFF",
    bg:      "rgba(107,92,255,0.14)",
    barBg:   "rgba(107,92,255,0.12)",
  },
  {
    title:   "Dedicar 5 horas semanales al aprendizaje",
    current: 2.5,
    target:  5,
    unit:    "horas",
    icon:    "⏱️",
    color:   "#5ACCA4",
    bg:      "rgba(90,204,164,0.14)",
    barBg:   "rgba(90,204,164,0.12)",
  },
  {
    title:   "Obtener certificación en Liderazgo",
    current: 0,
    target:  1,
    unit:    "certificación",
    icon:    "🏆",
    color:   "#E6CA52",
    bg:      "rgba(230,202,82,0.14)",
    barBg:   "rgba(230,202,82,0.12)",
  },
];

const card: React.CSSProperties = {
  background:   "rgba(255,255,255,0.08)",
  border:       "1px solid rgba(107,92,255,0.25)",
  borderRadius: 16,
};

export default function GoalsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#F9FAFC" }}>
          Mis Objetivos
        </h1>
        <p className="text-sm mt-1" style={{ color: "rgba(249,250,252,0.45)" }}>
          Seguimiento de tus metas de aprendizaje y desarrollo.
        </p>
      </div>

      <div className="space-y-4">
        {GOALS.map((goal) => {
          const pct = Math.round((goal.current / goal.target) * 100);
          return (
            <div key={goal.title} className="p-5 rounded-2xl" style={card}>
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: goal.bg }}
                >
                  {goal.icon}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Title + badge */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h2 className="text-sm font-semibold leading-snug" style={{ color: "#F9FAFC" }}>
                      {goal.title}
                    </h2>
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-bold flex-shrink-0"
                      style={{
                        background: goal.bg,
                        color:      goal.color,
                        border:     `1px solid ${goal.color}44`,
                      }}
                    >
                      {pct}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div
                    className="rounded-full h-2 mb-2"
                    style={{ background: "rgba(255,255,255,0.07)" }}
                  >
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{ width: `${pct}%`, background: goal.color }}
                    />
                  </div>

                  {/* Progress text */}
                  <p className="text-xs" style={{ color: "rgba(249,250,252,0.45)" }}>
                    <span className="font-semibold" style={{ color: goal.color }}>
                      {goal.current}
                    </span>
                    {" / "}
                    {goal.target} {goal.unit}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tip */}
      <div
        className="p-5 rounded-2xl"
        style={{
          background: "rgba(107,92,255,0.1)",
          border:     "1px solid rgba(107,92,255,0.25)",
          borderRadius: 16,
        }}
      >
        <p className="text-sm font-bold mb-1" style={{ color: "#F9FAFC" }}>
          Consejo
        </p>
        <p className="text-xs leading-relaxed" style={{ color: "rgba(249,250,252,0.55)" }}>
          Mantén el ritmo de aprendizaje completando al menos un módulo por día.
          La constancia es la clave para desarrollar habilidades duraderas.
        </p>
      </div>
    </div>
  );
}
