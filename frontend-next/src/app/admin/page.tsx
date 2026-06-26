"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, Spinner } from "@heroui/react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminDashboardPage() {
  const { session, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !session) {
      router.replace("/login");
    }
  }, [isLoading, session, router]);

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
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Monitor and manage the Alice platform.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card>
            <Card.Header>
              <Card.Title>Session</Card.Title>
            </Card.Header>
            <Card.Content>
              <p className="text-sm text-gray-500">Signed in as</p>
              <p className="font-semibold text-gray-900 mt-1">{user?.email}</p>
              <span className="inline-block mt-2 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium">
                Administrator
              </span>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <Card.Title>Quick Navigation</Card.Title>
            </Card.Header>
            <Card.Content>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/admin/users"
                    className="text-indigo-600 hover:text-indigo-700 hover:underline font-medium"
                  >
                    View all users →
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/statistics"
                    className="text-indigo-600 hover:text-indigo-700 hover:underline font-medium"
                  >
                    View statistics →
                  </Link>
                </li>
              </ul>
            </Card.Content>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
