import { get, post } from "./apiClient";
import type {
  LoginPayload,
  RegisterPayload,
  AuthSession,
  AuthUser,
} from "@/types/auth";

export function loginUser(payload: LoginPayload): Promise<AuthSession> {
  return post<AuthSession>("/auth/login", payload);
}

export function registerUser(payload: RegisterPayload): Promise<AuthSession> {
  return post<AuthSession>("/auth/register", payload);
}

export function getCurrentUser(token: string): Promise<AuthUser> {
  return get<AuthUser>("/auth/me", token);
}

export function refreshSession(refreshToken: string): Promise<AuthSession> {
  return post<AuthSession>("/auth/refresh", { refresh_token: refreshToken });
}
