"use client"

import Link from "next/link"
import { useStore } from "@/store/appStore"
import PaletteGrid from "@/components/palettes-module/PaletteGrid"
import AddPaletteForm from "@/components/palettes-module/AddPaletteForm"
import { AiPaletteGenerator } from "@/components/palettes-module/AiPaletteGenerator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/shared/PageHeader"
import { EmptyState } from "@/components/shared/EmptyState"
import { Plus, Palette, Sparkles } from "lucide-react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

function PaletteEmpty({
  title,
  description,
  showAction = true,
}: {
  title: string
  description: string
  showAction?: boolean
}) {
  return (
    <EmptyState
      icon={Palette}
      title={title}
      description={description}
      action={
        showAction ? (
          <Link href="/generator">
            <Button variant="outline">Go to Generator</Button>
          </Link>
        ) : undefined
      }
    />
  )
}

export default function PalettesPage() {
  const { palettes, removePalette, updatePalette } = useStore()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const favoritePalettes = palettes.filter((p) => p.isFavorite)
  const recentPalettes = [...palettes]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 10)

  return (
    <div className="page-shell">
      <PageHeader
        title="Color Palettes"
        description="Create, organize, and generate palettes for your projects."
        actions={
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                New Palette
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Palette</DialogTitle>
              </DialogHeader>
              <AddPaletteForm onSuccess={() => setIsAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        }
      />

      <Tabs defaultValue="all" className="space-y-4 sm:space-y-6">
        <div className="tabs-scroll">
          <TabsList className="inline-flex w-max min-w-full sm:min-w-0 h-auto p-1 bg-muted/60">
            <TabsTrigger value="all" className="px-4 py-2">
              All
            </TabsTrigger>
            <TabsTrigger value="favorites" className="px-4 py-2">
              Favorites
            </TabsTrigger>
            <TabsTrigger value="recent" className="px-4 py-2">
              Recent
            </TabsTrigger>
            <TabsTrigger value="ai" className="px-4 py-2 gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              AI
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all">
          <Card className="surface-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Your Palettes</CardTitle>
            </CardHeader>
            <CardContent>
              {palettes.length === 0 ? (
                <PaletteEmpty
                  title="No palettes yet"
                  description="Create a palette manually, extract colors from an image, or use the AI generator."
                />
              ) : (
                <PaletteGrid
                  palettes={palettes}
                  onDelete={removePalette}
                  onEdit={updatePalette}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="favorites">
          <Card className="surface-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Favorite Palettes</CardTitle>
            </CardHeader>
            <CardContent>
              {favoritePalettes.length === 0 ? (
                <PaletteEmpty
                  title="No favorites yet"
                  description="Tap the heart on any palette to save it here."
                  showAction={false}
                />
              ) : (
                <PaletteGrid
                  palettes={favoritePalettes}
                  onDelete={removePalette}
                  onEdit={updatePalette}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent">
          <Card className="surface-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Recently Created</CardTitle>
            </CardHeader>
            <CardContent>
              {recentPalettes.length === 0 ? (
                <PaletteEmpty
                  title="Nothing recent"
                  description="Palettes you create will appear here."
                />
              ) : (
                <PaletteGrid
                  palettes={recentPalettes}
                  onDelete={removePalette}
                  onEdit={updatePalette}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <AiPaletteGenerator />
        </TabsContent>
      </Tabs>
    </div>
  )
}
