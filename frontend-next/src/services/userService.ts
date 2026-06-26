import { get, ApiClientError } from "./apiClient";
import type { UserProfile } from "@/types/user";
import type { AuthUser } from "@/types/auth";

/**
 * Fetches the authenticated user's profile.
 * Primary: GET /auth/me  (Supabase Auth — no DB required, always works)
 * Fallback: null on any error (email/name are already in AuthContext)
 */
export async function getUserProfile(
  _userId: string,
  token: string,
): Promise<UserProfile | null> {
  try {
    const me = await get<AuthUser>("/auth/me", token);
    // Map AuthUser → UserProfile shape (DB-only fields stay null)
    return {
      id: me.user_id,
      email: me.email,
      username: null,
      display_name:
        me.first_name || me.last_name
          ? `${me.first_name ?? ""} ${me.last_name ?? ""}`.trim()
          : null,
      avatar_url: null,
      biografia: null,
      soft_skill_goal: null,
      preferences: null,
      created_at: null,
      updated_at: null,
    };
  } catch (err) {
    if (err instanceof ApiClientError && (err.status === 401 || err.status === 404)) {
      return null;
    }
    throw err;
  }
}
