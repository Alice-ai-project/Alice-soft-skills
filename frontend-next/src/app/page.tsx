import type { Metadata } from "next";
import HeroSection from "@/components/landing/HeroSection";

export const metadata: Metadata = {
  title: "Alice Soft Skills — AI-Powered Soft Skills Platform",
  description:
    "Discover your strengths, receive personalized recommendations, and improve your communication, leadership, and decision-making skills through an AI-assisted learning experience.",
};

export default function LandingPage() {
  return <HeroSection />;
}
