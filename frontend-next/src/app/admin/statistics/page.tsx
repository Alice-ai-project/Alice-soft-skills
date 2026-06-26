"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Spinner } from "@heroui/react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { getStatistics } from "@/services/adminService";
import type { AdminStatistics } from "@/types/admin";

interface StatCardProps {
  label: string;
  value: number | string;
  description: string;
}

function StatCard({ label, value, description }: StatCardProps) {
  return (
    <Card>
      <Card.Content className="p-6">
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-4xl font-bold text-gray-900 mt-2">{value}</p>
        <p className="text-xs text-gray-400 mt-2">{description}</p>
      </Card.Content>
    </Card>
  );
}

export default function AdminStatisticsPage() {
  const { session, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStatistics | null>(null);
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
    getStatistics(session.access_token)
      .then(setStats)
      .catch((err: unknown) => {
        const msg =
          err instanceof Error ? err.message : "Failed to load statistics.";
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Statistics</h1>
          <p className="text-gray-500 mt-1 text-sm">
            General platform metrics.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div
            role="alert"
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
          >
            {error}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              label="Total Users"
              value={stats.total_users}
              description="All registered accounts on the platform"
            />
            <Card>
              <Card.Content className="p-6">
                <p className="text-sm text-gray-500 font-medium">
                  More Metrics
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Additional statistics will appear here as more endpoints
                  become available.
                </p>
              </Card.Content>
            </Card>
          </div>
        ) : (
          <p className="text-gray-400 text-sm">
            No statistics available yet.
          </p>
        )}
      </div>
    </AdminLayout>
  );
}
