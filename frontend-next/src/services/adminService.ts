import { get } from "./apiClient";
import type { AdminUser, AdminStatistics } from "@/types/admin";

export function listUsers(token: string): Promise<AdminUser[]> {
  return get<AdminUser[]>("/api/v1/admin/users", token);
}

export function getStatistics(token: string): Promise<AdminStatistics> {
  return get<AdminStatistics>("/api/v1/admin/statistics", token);
}
