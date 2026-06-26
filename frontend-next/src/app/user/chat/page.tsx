"use client";

import ChatInterface from "@/components/chat/ChatInterface";

export default function ChatPage() {
  return (
    <div
      className="flex flex-col gap-4"
      style={{ height: "calc(100vh - 160px)", minHeight: 520 }}
    >
      <div className="flex-shrink-0">
        <h1 className="text-xl font-semibold" style={{ color: "#F9FAFC" }}>
          Chat con Alice
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "rgba(249,250,252,0.4)" }}>
          Habla o escribe con tu asistente de habilidades blandas.
        </p>
      </div>

      <div className="flex-1 min-h-0">
        <ChatInterface />
      </div>
    </div>
  );
}
