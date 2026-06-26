export default function AliceLogoMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "65%", height: "65%" }}
    >
      {/* Left leg — apex to bottom-left */}
      <line
        x1="12" y1="3.5" x2="4" y2="20.5"
        stroke="white" strokeWidth="1.4" strokeOpacity="0.75" strokeLinecap="round"
      />
      {/* Right leg — apex to bottom-right */}
      <line
        x1="12" y1="3.5" x2="20" y2="20.5"
        stroke="white" strokeWidth="1.4" strokeOpacity="0.75" strokeLinecap="round"
      />
      {/* Crossbar */}
      <line
        x1="7.5" y1="13.5" x2="16.5" y2="13.5"
        stroke="white" strokeWidth="1.1" strokeOpacity="0.5" strokeLinecap="round"
      />

      {/* Bottom-left node — mint */}
      <circle cx="4" cy="20.5" r="1.8" fill="#5ACCA4" />
      {/* Bottom-right node — mauve */}
      <circle cx="20" cy="20.5" r="1.8" fill="#EAA2FC" />

      {/* Left crossbar node */}
      <circle cx="7.5" cy="13.5" r="1.15" fill="rgba(255,255,255,0.72)" />
      {/* Right crossbar node */}
      <circle cx="16.5" cy="13.5" r="1.15" fill="rgba(255,255,255,0.72)" />

      {/* Apex — outer glow ring */}
      <circle cx="12" cy="3.5" r="3.2" fill="white" fillOpacity="0.14" />
      {/* Apex — core */}
      <circle cx="12" cy="3.5" r="2" fill="white" />
    </svg>
  );
}
