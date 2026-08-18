"use client"

import Link from "next/link"
import StatsDashboard from "@/components/dashboard-module/StatsDashboard"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="page-shell">
      <PageHeader
        title="Dashboard"
        description="A snapshot of your images, palettes, and how you organize them."
        actions={
          <Link href="/generator" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              Add image
            </Button>
          </Link>
        }
      />
      <StatsDashboard />
    </div>
  )
}
