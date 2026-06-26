export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface AuthUser {
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string | null;
}

export interface AuthSession {
  access_token: string | null;
  refresh_token: string | null;
  token_type: string;
  expires_in: number | null;
  user: AuthUser;
  email_confirmation_required: boolean;
}

export interface StoredSession {
  access_token: string;
  refresh_token: string;
  user: AuthUser;
}
