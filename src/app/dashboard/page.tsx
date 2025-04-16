"use client";

import StatsDashboard from "@/components/dashboard-module/StatsDashboard";

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <StatsDashboard />
    </div>
  );
}
