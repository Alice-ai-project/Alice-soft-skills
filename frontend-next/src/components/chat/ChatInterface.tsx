"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { sendChatMessage } from "@/services/chatService";
import { ApiClientError } from "@/services/apiClient";
import type { ChatMessage } from "@/types/chat";

// ─── Types ────────────────────────────────────────────────────────────────────

type Status = "idle" | "recording" | "processing";

const STATUS_LABELS: Record<Status, string> = {
  idle:       "Lista para escucharte",
  recording:  "Escuchando…",
  processing: "Procesando…",
};

// Status dot color per state
const STATUS_COLOR: Record<Status, string> = {
  idle:       "#5ACCA4",
  recording:  "#EAA2FC",
  processing: "#E6CA52",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function mapError(err: unknown): string {
  if (err instanceof ApiClientError) {
    const map: Record<string, string> = {
      AI_SERVICE_NOT_CONFIGURED:  "El servicio de IA no está configurado aún.",
      AI_SERVICE_TIMEOUT:         "Alice tardó demasiado en responder. Inténtalo de nuevo.",
      AI_SERVICE_UNAVAILABLE:     "Alice no está disponible ahora mismo. Inténtalo más tarde.",
      network_error:              "No se pudo conectar al servidor. Verifica tu conexión.",
    };
    return map[err.code] ?? err.message;
  }
  return "Algo salió mal. Inténtalo de nuevo.";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="flex items-center gap-1" style={{ padding: "10px 16px" }}>
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="w-2 h-2 rounded-full animate-bounce"
          style={{ background: "rgba(169,156,255,0.65)", animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  );
}

function MicIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  );
}

function StopIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}

function VolumeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15.536 8.464a5 5 0 010 7.072M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
  );
}

function MuteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
    </svg>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );
}

// Thin gradient divider
function Divider() {
  return (
    <div
      className="flex-shrink-0"
      style={{
        height: 1,
        background: "linear-gradient(90deg, transparent, rgba(107,92,255,0.22), transparent)",
      }}
    />
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ChatInterface() {
  const { session } = useAuth();

  const [messages,       setMessages]       = useState<ChatMessage[]>([]);
  const [input,          setInput]          = useState("");
  const [status,         setStatus]         = useState<Status>("idle");
  const [isMuted,        setIsMuted]        = useState(false);
  const [error,          setError]          = useState<string | null>(null);
  const [speechSupported,setSpeechSupported] = useState(true);
  const [conversationId, setConversationId] = useState<string | undefined>();

  const bottomRef        = useRef<HTMLDivElement>(null);
  const textareaRef      = useRef<HTMLTextAreaElement>(null);
  const recognitionRef   = useRef<SpeechRecognition | null>(null);
  const transcriptRef    = useRef<string>("");
  const isMutedRef       = useRef(false);
  const sessionRef       = useRef(session);
  const conversationIdRef= useRef(conversationId);

  isMutedRef.current        = isMuted;
  sessionRef.current        = session;
  conversationIdRef.current = conversationId;

  // ── Initialization ──────────────────────────────────────────────────────────

  useEffect(() => {
    const supported =
      typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);
    setSpeechSupported(supported);
  }, []);

  useEffect(() => {
    const ctx = localStorage.getItem("alice_chat_context");
    if (!ctx) return;
    localStorage.removeItem("alice_chat_context");
    setMessages([{
      id: uid(), role: "assistant",
      content: `¡Perfecto! Vamos a trabajar en "${ctx}". Cuéntame, ¿qué situaciones has enfrentado recientemente donde sientas que podrías mejorar en esta área?`,
      createdAt: new Date().toISOString(),
    }]);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  // ── Speech synthesis (TTS) ─────────────────────────────────────────────────

  function speak(text: string) {
    if (isMutedRef.current || typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang  = "es-ES";
    utt.rate  = 1.0;
    utt.pitch = 1.05;
    window.speechSynthesis.speak(utt);
  }

  // ── Core: send message ─────────────────────────────────────────────────────

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || !sessionRef.current) return;

    setMessages((prev) => [
      ...prev,
      { id: uid(), role: "user", content: trimmed, createdAt: new Date().toISOString() },
    ]);
    setError(null);
    setStatus("processing");

    try {
      const res = await sendChatMessage(
        { message: trimmed, conversation_id: conversationIdRef.current },
        sessionRef.current.access_token,
      );
      if (res.conversation_id) {
        setConversationId(res.conversation_id);
        conversationIdRef.current = res.conversation_id;
      }
      setMessages((prev) => [
        ...prev,
        { id: uid(), role: "assistant", content: res.reply, createdAt: new Date().toISOString() },
      ]);
      speak(res.reply);
    } catch (err) {
      setError(mapError(err));
    } finally {
      setStatus("idle");
    }
  }

  // ── Voice input (STT) ──────────────────────────────────────────────────────

  function startVoice() {
    if (status !== "idle" || !speechSupported) return;
    const SpeechRecognitionAPI =
      typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SpeechRecognitionAPI) { setSpeechSupported(false); return; }

    const recognition = new SpeechRecognitionAPI();
    recognition.lang             = "es-ES";
    recognition.continuous       = false;
    recognition.interimResults   = false;
    recognition.maxAlternatives  = 1;
    recognitionRef.current       = recognition;
    transcriptRef.current        = "";

    recognition.onstart  = () => setStatus("recording");
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      transcriptRef.current = event.results[0]?.[0]?.transcript?.trim() ?? "";
    };
    recognition.onerror  = (event: SpeechRecognitionErrorEvent) => {
      if (event.error !== "aborted" && event.error !== "no-speech") {
        setError("No se pudo capturar el audio. Verifica que el micrófono esté habilitado.");
      }
      setStatus("idle");
    };
    recognition.onend = () => {
      recognitionRef.current = null;
      const transcript = transcriptRef.current;
      if (transcript) sendMessage(transcript);
      else setStatus("idle");
    };

    try {
      recognition.start();
    } catch {
      setError("No se pudo acceder al micrófono.");
      setStatus("idle");
    }
  }

  function stopVoice()  { recognitionRef.current?.stop(); }

  function toggleMute() {
    setIsMuted((prev) => {
      const next = !prev;
      if (next && typeof window !== "undefined") window.speechSynthesis?.cancel();
      return next;
    });
  }

  // ── Text input ─────────────────────────────────────────────────────────────

  function handleTextSend() {
    const text = input.trim();
    if (!text || status === "processing") return;
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    sendMessage(text);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleTextSend(); }
  }

  // ── Derived ────────────────────────────────────────────────────────────────

  const isRecording  = status === "recording";
  const isProcessing = status === "processing";
  const statusColor  = STATUS_COLOR[status];

  // ─────────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div
      className="h-full flex flex-col rounded-2xl overflow-hidden select-none"
      style={{
        background: "#0E1240",
        border: "1px solid rgba(107,92,255,0.25)",
      }}
    >

      {/* ── CENTRAL ZONE — Avatar + Voice ────────────────────────────────── */}
      {/*    Subtle purple radial glow flows downward from this section       */}
      <div
        className="flex flex-col items-center flex-shrink-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 100% at 50% 0%, rgba(107,92,255,0.18), transparent 72%)",
          padding: "32px 24px 28px",
        }}
      >
        {/* ── Avatar placeholder (avatar will be mounted here later) ─────── */}
        <div className="relative" style={{ width: 120, height: 120 }}>
          {/* Outer pulse ring 1 */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: "1.5px solid rgba(107,92,255,0.45)",
              animation: "pulse-ring 2.8s ease-out infinite",
            }}
          />
          {/* Outer pulse ring 2 — offset */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: "1.5px solid rgba(107,92,255,0.45)",
              animation: "pulse-ring 2.8s 1.4s ease-out infinite",
            }}
          />
          {/* Avatar core */}
          <div
            className="absolute rounded-full flex items-center justify-center"
            style={{
              inset: 12,
              zIndex: 1,
              background: "linear-gradient(135deg, #6B5CFF 0%, #9c85ff 100%)",
              boxShadow: "0 0 32px rgba(107,92,255,0.45), 0 0 8px rgba(107,92,255,0.2)",
            }}
          >
            <span
              className="text-white font-bold leading-none"
              style={{ fontSize: 38 }}
            >
              A
            </span>
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2 mt-5">
          <div
            className={`w-2 h-2 rounded-full ${isRecording || isProcessing ? "animate-pulse" : ""}`}
            style={{
              background: statusColor,
              boxShadow: `0 0 7px ${statusColor}`,
            }}
          />
          <span className="text-sm font-medium" style={{ color: "rgba(249,250,252,0.58)" }}>
            {STATUS_LABELS[status]}
          </span>
        </div>

        {/* ── Microphone — main interaction trigger ──────────────────────── */}
        <div className="relative mt-6 flex flex-col items-center gap-3">
          {/* Ripple rings while recording */}
          {isRecording && (
            <>
              <div
                className="absolute rounded-full pointer-events-none"
                style={{
                  inset: -10,
                  border: "2px solid rgba(107,92,255,0.45)",
                  animation: "ripple-mic 1.6s ease-out infinite",
                }}
              />
              <div
                className="absolute rounded-full pointer-events-none"
                style={{
                  inset: -10,
                  border: "2px solid rgba(107,92,255,0.45)",
                  animation: "ripple-mic 1.6s 0.8s ease-out infinite",
                }}
              />
            </>
          )}

          {/* Mic button */}
          <button
            onClick={isRecording ? stopVoice : startVoice}
            disabled={!speechSupported || isProcessing}
            className="relative flex items-center justify-center rounded-full transition-all duration-200"
            style={{
              width: 80,
              height: 80,
              zIndex: 1,
              background: isRecording
                ? "rgba(107,92,255,0.88)"
                : "rgba(107,92,255,0.1)",
              border: `2px solid ${isRecording ? "#6B5CFF" : "rgba(107,92,255,0.38)"}`,
              boxShadow: isRecording
                ? "0 0 40px rgba(107,92,255,0.55), 0 0 14px rgba(107,92,255,0.35)"
                : "none",
              color: "#F9FAFC",
              opacity: !speechSupported || isProcessing ? 0.32 : 1,
              cursor: !speechSupported || isProcessing ? "not-allowed" : "pointer",
            }}
            aria-label={isRecording ? "Detener grabación" : "Hablar con Alice"}
          >
            <MicIcon className="w-7 h-7" />
          </button>

          {/* Stop pill — appears only while recording */}
          {isRecording && (
            <button
              onClick={stopVoice}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-all"
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#fca5a5",
              }}
            >
              <StopIcon className="w-3 h-3" />
              Detener
            </button>
          )}
        </div>
      </div>

      {/* ── gradient divider ────────────────────────────────────────────────── */}
      <Divider />

      {/* ── MESSAGE HISTORY ──────────────────────────────────────────────────── */}
      <div
        className="flex-1 min-h-0 overflow-y-auto px-5 py-4 space-y-3"
        style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(107,92,255,0.15) transparent" }}
      >
        {messages.length === 0 && !isProcessing && (
          <div className="h-full flex flex-col items-center justify-center text-center gap-1.5 select-none">
            <p className="text-sm" style={{ color: "rgba(249,250,252,0.38)" }}>
              Usa el micrófono o escribe para comenzar
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            {msg.role === "assistant" && (
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "linear-gradient(135deg, #6B5CFF, #9c85ff)" }}
              >
                <span className="text-white font-bold" style={{ fontSize: 11 }}>A</span>
              </div>
            )}
            <div
              className="max-w-[78%] text-sm leading-relaxed whitespace-pre-wrap"
              style={{
                padding: "10px 14px",
                color: "#F9FAFC",
                borderRadius:
                  msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                background:
                  msg.role === "user"
                    ? "rgba(107,92,255,0.72)"
                    : "rgba(255,255,255,0.04)",
                border:
                  msg.role === "assistant"
                    ? "1px solid rgba(107,92,255,0.18)"
                    : "none",
                backdropFilter:
                  msg.role === "assistant" ? "blur(8px)" : "none",
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: "linear-gradient(135deg, #6B5CFF, #9c85ff)" }}
            >
              <span className="text-white font-bold" style={{ fontSize: 11 }}>A</span>
            </div>
            <div
              style={{
                borderRadius: "18px 18px 18px 4px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(107,92,255,0.18)",
              }}
            >
              <TypingDots />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Error banner ────────────────────────────────────────────────────── */}
      {error && (
        <div className="px-5 pb-2 flex-shrink-0">
          <div
            className="flex items-start gap-2 rounded-xl px-3 py-2 text-xs"
            style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.22)",
              color: "#fca5a5",
            }}
          >
            <span className="flex-shrink-0 mt-0.5">⚠</span>
            <span className="flex-1 leading-snug">{error}</span>
            <button
              onClick={() => setError(null)}
              className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity"
              aria-label="Cerrar error"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ── gradient divider ────────────────────────────────────────────────── */}
      <Divider />

      {/* ── TEXT INPUT ───────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 px-5 py-4">
        {!speechSupported && (
          <p className="text-center text-xs mb-3" style={{ color: "rgba(239,68,68,0.75)" }}>
            Tu navegador no soporta reconocimiento de voz. Usa el campo de texto.
          </p>
        )}

        <div className="flex gap-2.5 items-end">
          {/* Mute toggle — moved here so the center stays clean */}
          <button
            onClick={toggleMute}
            className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150"
            style={{
              background: isMuted ? "rgba(239,68,68,0.1)" : "rgba(107,92,255,0.08)",
              border: `1px solid ${isMuted ? "rgba(239,68,68,0.3)" : "rgba(107,92,255,0.2)"}`,
              color: isMuted ? "#fca5a5" : "rgba(249,250,252,0.55)",
            }}
            aria-label={isMuted ? "Activar sonido" : "Silenciar respuestas"}
          >
            {isMuted ? <MuteIcon className="w-4 h-4" /> : <VolumeIcon className="w-4 h-4" />}
          </button>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
            }}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            placeholder="O escribe aquí…"
            rows={1}
            className="flex-1 resize-none text-sm focus:outline-none transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "rgba(107,92,255,0.06)",
              border: "1px solid rgba(107,92,255,0.2)",
              borderRadius: 14,
              padding: "9px 14px",
              color: "#F9FAFC",
              maxHeight: 100,
            }}
          />

          <button
            onClick={handleTextSend}
            disabled={!input.trim() || isProcessing}
            className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-opacity duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: "rgba(107,92,255,0.8)", color: "#F9FAFC" }}
            aria-label="Enviar"
          >
            <SendIcon className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[10px] mt-1.5 ml-[52px]" style={{ color: "rgba(249,250,252,0.2)" }}>
          Enter para enviar · Shift+Enter para nueva línea
        </p>
      </div>

    </div>
  );
}
