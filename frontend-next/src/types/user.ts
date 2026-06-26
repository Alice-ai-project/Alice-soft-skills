export interface UserProfile {
  id: string;
  email: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  biografia: string | null;
  soft_skill_goal: string | null;
  preferences: Record<string, unknown> | null;
  created_at: string | null;
  updated_at: string | null;
}
