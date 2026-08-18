"use client"

import StatsDashboard from "@/components/dashboard-module/StatsDashboard"
import { PageHeader } from "@/components/shared/PageHeader"

export default function DashboardPage() {
  return (
    <div className="page-shell">
      <PageHeader
        title="Dashboard"
        description="Overview of your images, palettes, tags, and groups."
      />
      <StatsDashboard />
    </div>
  )
}
