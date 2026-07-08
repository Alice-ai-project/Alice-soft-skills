"use client";

const RESOURCES = [
  {
    type:        "youtube" as const,
    videoId:     "BC0KozsEIOE",
    title:       "Cómo optimizar tu PERFIL DE LINKEDIN",
    description: "Aprende a construir un perfil profesional que atraiga oportunidades laborales.",
  },
  {
    type:        "youtube" as const,
    videoId:     "soekTy3b9EY",
    title:       "El Curriculum que me Consiguió +50 Entrevistas | Paso a Paso",
    description: "Estrategias probadas para crear un CV que destaque frente a los reclutadores.",
  },
  {
    type:        "youtube" as const,
    videoId:     "DWFs6aqknqw",
    title:       "How to level up your GitHub profile README (Basic to Pro!)",
    description: "Potencia tu presencia en GitHub con un README profesional e impactante.",
  },
  {
    type:        "pdf" as const,
    title:       "El Arte de la Guerra — Sun Tzu",
    description: "Clásico de la estrategia y el liderazgo aplicable al entorno profesional moderno.",
    url:         "/docs/El_arte_de_la_guerra-Sun_Tzu.pdf",
  },
];

const card: React.CSSProperties = {
  background:   "rgba(255,255,255,0.08)",
  border:       "1px solid rgba(124,58,237,0.25)",
  borderRadius: 14,
  transition:   "border-color 0.15s, box-shadow 0.15s",
};

export default function ResourcesPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#F9FAFC" }}>
          Recursos Adicionales
        </h1>
        <p className="text-sm mt-1" style={{ color: "rgba(249,250,252,0.45)" }}>
          Materiales complementarios para potenciar tu desarrollo profesional.
        </p>
      </div>

      <div className="space-y-4">
        {RESOURCES.map((res) => {

          if (res.type === "youtube") {
            const thumb = `https://img.youtube.com/vi/${res.videoId}/mqdefault.jpg`;
            const href  = `https://www.youtube.com/watch?v=${res.videoId}`;
            return (
              <a
                key={res.videoId}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 p-4"
                style={card}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(254,101,79,0.45)";
                  (e.currentTarget as HTMLElement).style.boxShadow   = "0 0 20px rgba(254,101,79,0.08)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(124,58,237,0.25)";
                  (e.currentTarget as HTMLElement).style.boxShadow   = "none";
                }}
              >
                {/* Thumbnail */}
                <div className="relative w-28 h-16 rounded-lg overflow-hidden flex-shrink-0"
                     style={{ background: "rgba(0,0,0,0.3)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumb} alt={res.title} className="w-full h-full object-cover opacity-90" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                      style={{ background: "#FE654F" }}
                    >
                      <svg className="w-3 h-3 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <span
                    className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide mb-1"
                    style={{ background: "rgba(254,101,79,0.15)", color: "#FE654F" }}
                  >
                    YouTube
                  </span>
                  <h2 className="text-sm font-semibold leading-snug line-clamp-2" style={{ color: "#F9FAFC" }}>
                    {res.title}
                  </h2>
                  <p className="text-xs mt-1 leading-relaxed line-clamp-2"
                     style={{ color: "rgba(249,250,252,0.45)" }}>
                    {res.description}
                  </p>
                </div>
              </a>
            );
          }

          return (
            <a
              key={res.title}
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 p-4"
              style={card}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(124,58,237,0.45)";
                (e.currentTarget as HTMLElement).style.boxShadow   = "0 0 20px rgba(124,58,237,0.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(124,58,237,0.25)";
                (e.currentTarget as HTMLElement).style.boxShadow   = "none";
              }}
            >
              {/* PDF icon */}
              <div
                className="w-12 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(254,101,79,0.12)", border: "1px solid rgba(254,101,79,0.25)" }}
              >
                <svg className="w-6 h-6" style={{ color: "#FE654F" }}
                     fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <span
                  className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide mb-1"
                  style={{ background: "rgba(254,101,79,0.15)", color: "#FE654F" }}
                >
                  PDF
                </span>
                <h2 className="text-sm font-semibold leading-snug" style={{ color: "#F9FAFC" }}>
                  {res.title}
                </h2>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: "rgba(249,250,252,0.45)" }}>
                  {res.description}
                </p>
              </div>

              {/* Download arrow */}
              <svg
                className="w-4 h-4 flex-shrink-0 self-center"
                style={{ color: "rgba(124,58,237,0.5)" }}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </a>
          );
        })}
      </div>
    </div>
  );
}
