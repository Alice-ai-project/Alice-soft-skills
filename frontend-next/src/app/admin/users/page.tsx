"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Chip, Spinner } from "@heroui/react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { listUsers } from "@/services/adminService";
import type { AdminUser } from "@/types/admin";

export default function AdminUsersPage() {
  const { session, isLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !session) {
      router.replace("/login");
    }
  }, [isLoading, session, router]);

  useEffect(() => {
    if (!session) return;
    setLoading(true);
    listUsers(session.access_token)
      .then(setUsers)
      .catch((err: unknown) => {
        const msg =
          err instanceof Error ? err.message : "Failed to load users.";
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [session]);

  if (isLoading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Users</h1>
            <p className="text-gray-500 mt-1 text-sm">
              All registered users on the platform.
            </p>
          </div>
          {!loading && !error && (
            <span className="text-sm text-gray-400">{users.length} users</span>
          )}
        </div>

        <Card>
          <Card.Content className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Spinner size="lg" />
              </div>
            ) : error ? (
              <div className="p-6">
                <div
                  role="alert"
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
                >
                  {error}
                </div>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-16 text-gray-400 text-sm">
                No users found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {["Name", "Email", "Role", "Status", "Joined"].map(
                        (h) => (
                          <th
                            key={h}
                            className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((u) => {
                      const fullName =
                        u.first_name || u.last_name
                          ? `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim()
                          : null;
                      return (
                        <tr
                          key={u.user_id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3 font-medium text-gray-900">
                            {fullName ?? <span className="text-gray-400">—</span>}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {u.email}
                          </td>
                          <td className="px-4 py-3">
                            <Chip
                              size="sm"
                              color={u.role === "admin" ? "accent" : "default"}
                              variant="secondary"
                            >
                              {u.role ?? "user"}
                            </Chip>
                          </td>
                          <td className="px-4 py-3">
                            <Chip
                              size="sm"
                              color={
                                u.status === "active" ? "success" : "warning"
                              }
                              variant="secondary"
                            >
                              {u.status ?? "unknown"}
                            </Chip>
                          </td>
                          <td className="px-4 py-3 text-gray-400">
                            {u.created_at
                              ? new Date(u.created_at).toLocaleDateString()
                              : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card.Content>
        </Card>
      </div>
    </AdminLayout>
  );
}
