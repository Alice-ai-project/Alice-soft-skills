"use client";

import { useEffect, useRef } from "react";

export default function DIdAvatar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create unique target id
    const targetId = `did-agent-${Date.now()}`;
    containerRef.current.id = targetId;

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

    containerRef.current.appendChild(script);
    scriptRef.current = script;

    return () => {
      // Cleanup on unmount
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
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
