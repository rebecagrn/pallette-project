"use client"

import ImagesModule from "@/components/images-module/ImagesModule"
import { PageHeader } from "@/components/shared/PageHeader"

export default function GeneratorPage() {
  return (
    <div className="page-shell">
      <PageHeader
        title="Generator"
        description="Upload a photo, extract its colors, or let AI turn it into a palette."
      />
      <ImagesModule />
    </div>
  )
}
