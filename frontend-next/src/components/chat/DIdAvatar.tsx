"use client";

import { useEffect, useRef } from "react";

export default function DIdAvatar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear any leftover D-ID elements from previous mount
    container.innerHTML = "";

    // Create unique target id
    const targetId = `did-agent-${Date.now()}`;
    container.id = targetId;

    // Create and append D-ID script
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://agent.d-id.com/v2/index.js";
    script.dataset.mode = "full";
    script.dataset.clientKey = "ck_8uTOwtpJmLM0_Qll8MxZn";
    script.dataset.agentId = "v2_agt_ZxB1x5jg";
    script.dataset.name = "did-agent";
    script.dataset.monitor = "true";
    script.dataset.targetId = targetId;

    container.appendChild(script);
    scriptRef.current = script;

    return () => {
      // Remove script
      if (scriptRef.current?.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
      }
      // Remove ALL D-ID created elements (iframe, shadow DOM, etc.)
      if (container) {
        container.innerHTML = "";
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
    />
  );
}
