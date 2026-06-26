"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

// Load only on client — Three.js is not SSR-safe
const NeuralBackground = dynamic(() => import("./NeuralBackground"), {
  ssr: false,
  loading: () => null,
});

// Routes where the neural background must NOT appear
const EXCLUDED: string[] = [
  "/user/chat",
];

function isExcluded(pathname: string): boolean {
  return EXCLUDED.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export default function BackgroundWrapper() {
  const pathname = usePathname();
  const hidden   = useMemo(() => isExcluded(pathname), [pathname]);

  if (hidden) return null;

  return <NeuralBackground />;
}
