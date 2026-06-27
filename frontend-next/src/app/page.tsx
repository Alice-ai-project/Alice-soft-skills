import type { Metadata } from "next";
import HeroSection from "@/components/landing/HeroSection";

export const metadata: Metadata = {
  title: "Alice Soft Skills — Plataforma de Soft Skills con IA",
  description:
    "Descubre tus fortalezas, recibe recomendaciones personalizadas y mejora tus habilidades de comunicación, liderazgo y toma de decisiones con una experiencia de aprendizaje asistida por IA.",
};

export default function LandingPage() {
  return <HeroSection />;
}
