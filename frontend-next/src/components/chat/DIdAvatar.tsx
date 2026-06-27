"use client";

import { useEffect, useRef } from "react";

const DID_SCRIPT_SRC = "https://agent.d-id.com/v2/index.js";
const DID_TARGET_ID = "did-avatar-container";

export default function DIdAvatar() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement("script");
    script.type = "module";
    script.src = DID_SCRIPT_SRC;
    script.dataset.mode = "full";
    script.dataset.clientKey = "ck_8uTOwtpJmLM0_Qll8MxZn";
    script.dataset.agentId = "v2_agt_ZxB1x5jg";
    script.dataset.name = "did-agent";
    script.dataset.monitor = "true";
    script.dataset.targetId = DID_TARGET_ID;

    containerRef.current.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id={DID_TARGET_ID}
      style={{
        width: "100%",
        height: "100%",
        minHeight: 0,
      }}
    />
  );
}
