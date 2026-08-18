"use client"

import ImagesModule from "@/components/images-module/ImagesModule"
import { PageHeader } from "@/components/shared/PageHeader"

export default function GeneratorPage() {
  return (
    <div className="page-shell">
      <PageHeader
        title="Generator"
        description="Upload images, extract colors, and create AI-enhanced palettes from your visual inspiration."
      />
      <ImagesModule />
    </div>
  )
}
