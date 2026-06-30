import { post } from "./apiClient";
import type {
  LoginPayload,
  RegisterPayload,
  AuthSession,
} from "@/types/auth";

export function loginUser(payload: LoginPayload): Promise<AuthSession> {
  return post<AuthSession>("/auth/login", payload);
}

export function registerUser(payload: RegisterPayload): Promise<AuthSession> {
  return post<AuthSession>("/auth/register", payload);
}

export function refreshSession(refreshToken: string): Promise<AuthSession> {
  return post<AuthSession>("/auth/refresh", { refresh_token: refreshToken });
}
