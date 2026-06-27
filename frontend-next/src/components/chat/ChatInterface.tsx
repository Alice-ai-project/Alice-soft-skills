"use client";

import DIdAvatar from "./DIdAvatar";

export default function ChatInterface() {
  return (
    <div
      className="h-full flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: "#0E1240",
        border: "1px solid rgba(107,92,255,0.25)",
      }}
    >
      <DIdAvatar />
    </div>
  );
}
