"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { StoredSession, AuthUser } from "@/types/auth";
import { setRefreshHandler } from "@/services/apiClient";
import { refreshSession } from "@/services/authService";

interface AuthContextValue {
  session: StoredSession | null;
  user: AuthUser | null;
  isLoading: boolean;
  setSession: (session: StoredSession | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_KEY = "alice_session";

function getInitialSession(): StoredSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw) as StoredSession;
  } catch {
    localStorage.removeItem(SESSION_KEY);
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<StoredSession | null>(getInitialSession);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!session?.refresh_token) {
      setRefreshHandler(null);
      return;
    }
    const rt = session.refresh_token;
    setRefreshHandler(async () => {
      try {
        const newAuth = await refreshSession(rt);
        if (newAuth.access_token && newAuth.refresh_token) {
          const stored: StoredSession = {
            access_token: newAuth.access_token,
            refresh_token: newAuth.refresh_token,
            user: newAuth.user,
          };
          setSession(stored);
          return stored.access_token;
        }
        return null;
      } catch {
        setSession(null);
        return null;
      }
    });
  }, [session?.refresh_token]);

  function setSession(s: StoredSession | null) {
    setSessionState(s);
    if (s) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }

  function logout() {
    setSession(null);
  }

  return (
    <AuthContext.Provider
      value={{ session, user: session?.user ?? null, isLoading, setSession, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
