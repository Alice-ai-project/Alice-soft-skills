export interface AdminUser {
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string | null;
  created_at: string | null;
  status: string | null;
}

export interface AdminStatistics {
  total_users: number;
}
