"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { useStore } from "@/store/appStore"
import PaletteGrid from "@/components/palettes-module/PaletteGrid"
import AddPaletteForm from "@/components/palettes-module/AddPaletteForm"
import { AiPaletteGenerator } from "@/components/palettes-module/AiPaletteGenerator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/shared/PageHeader"
import { EmptyState } from "@/components/shared/EmptyState"
import SearchBar from "@/components/shared/SearchBar"
import { Plus, Palette, Sparkles, ImagePlus, Heart } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ColorPaletteProps } from "@/types"

export default function PalettesPage() {
  const { palettes, tags, removePalette, updatePalette } = useStore()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const favoritePalettes = palettes.filter((palette) => palette.isFavorite)
  const recentPalettes = [...palettes]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 10)

  const matchesSearch = (palette: ColorPaletteProps) => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    const tagNames = palette.tagIds
      .map((tagId) => tags.find((tag) => tag.id === tagId)?.name ?? "")
      .join(" ")
    return (
      palette.name.toLowerCase().includes(query) ||
      palette.colors.some((color) => color.toLowerCase().includes(query)) ||
      tagNames.toLowerCase().includes(query)
    )
  }

  const filteredAll = useMemo(
    () => palettes.filter(matchesSearch),
    [palettes, searchQuery, tags]
  )
  const filteredFavorites = useMemo(
    () => favoritePalettes.filter(matchesSearch),
    [favoritePalettes, searchQuery, tags]
  )
  const filteredRecent = useMemo(
    () => recentPalettes.filter(matchesSearch),
    [recentPalettes, searchQuery, tags]
  )

  return (
    <div className="page-shell">
      <PageHeader
        title="Palettes"
        description="Build, favorite, and generate color sets for your projects."
        actions={
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                New palette
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create palette</DialogTitle>
              </DialogHeader>
              <AddPaletteForm onSuccess={() => setIsAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        }
      />

      <section className="relative overflow-hidden rounded-2xl border bg-card/90 p-5 sm:p-6 shadow-sm mb-6 sm:mb-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--brand-light)/0.16),_transparent_55%)]" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid grid-cols-3 gap-4 sm:gap-8">
            <div>
              <p className="text-2xl sm:text-3xl font-bold tabular-nums">
                {palettes.length}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">Total</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold tabular-nums">
                {favoritePalettes.length}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Favorites
              </p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold tabular-nums">
                {palettes.reduce((sum, palette) => sum + palette.colors.length, 0)}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">Colors</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              className="bg-background/80"
              onClick={() => setActiveTab("ai")}
            >
              <Sparkles className="h-4 w-4" />
              Generate with AI
            </Button>
            <Link href="/generator" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full bg-background/80">
                <ImagePlus className="h-4 w-4" />
                From an image
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="tabs-scroll">
            <TabsList className="inline-flex w-max min-w-full sm:min-w-0 h-auto bg-muted/60">
              <TabsTrigger value="all">
                All
                <span className="ml-1.5 text-xs opacity-70">{palettes.length}</span>
              </TabsTrigger>
              <TabsTrigger value="favorites">
                <Heart className="h-3.5 w-3.5 mr-1" />
                Favorites
                <span className="ml-1.5 text-xs opacity-70">
                  {favoritePalettes.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="ai" className="gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                AI
              </TabsTrigger>
            </TabsList>
          </div>
          {activeTab !== "ai" && palettes.length > 0 && (
            <div className="w-full sm:max-w-xs">
              <SearchBar
                onSearch={setSearchQuery}
                placeholder="Search name, hex, or tag..."
              />
            </div>
          )}
        </div>

        <TabsContent value="all">
          {palettes.length === 0 ? (
            <PaletteEmpty
              onCreate={() => setIsAddDialogOpen(true)}
              onAi={() => setActiveTab("ai")}
            />
          ) : filteredAll.length === 0 ? (
            <SearchEmpty />
          ) : (
            <PaletteGrid
              palettes={filteredAll}
              onDelete={removePalette}
              onEdit={updatePalette}
            />
          )}
        </TabsContent>

        <TabsContent value="favorites">
          {favoritePalettes.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="No favorites yet"
              description="Tap the heart on any palette to keep it here."
            />
          ) : filteredFavorites.length === 0 ? (
            <SearchEmpty />
          ) : (
            <PaletteGrid
              palettes={filteredFavorites}
              onDelete={removePalette}
              onEdit={updatePalette}
            />
          )}
        </TabsContent>

        <TabsContent value="recent">
          {recentPalettes.length === 0 ? (
            <PaletteEmpty
              onCreate={() => setIsAddDialogOpen(true)}
              onAi={() => setActiveTab("ai")}
            />
          ) : filteredRecent.length === 0 ? (
            <SearchEmpty />
          ) : (
            <PaletteGrid
              palettes={filteredRecent}
              onDelete={removePalette}
              onEdit={updatePalette}
            />
          )}
        </TabsContent>

        <TabsContent value="ai">
          <AiPaletteGenerator onSaved={() => setActiveTab("all")} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function PaletteEmpty({
  onCreate,
  onAi,
}: {
  onCreate: () => void
  onAi: () => void
}) {
  return (
    <div className="surface-card">
      <EmptyState
        icon={Palette}
        title="No palettes yet"
        description="Create one by hand, generate with AI, or extract colors from an image."
        action={
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={onCreate}>
              <Plus className="h-4 w-4" />
              New palette
            </Button>
            <Button variant="outline" onClick={onAi}>
              <Sparkles className="h-4 w-4" />
              Use AI
            </Button>
          </div>
        }
      />
    </div>
  )
}

function SearchEmpty() {
  return (
    <div className="surface-card">
      <EmptyState
        icon={Palette}
        title="No matches"
        description="Try another name, hex code, or tag."
      />
    </div>
  )
}
