"use client"

import { useStore } from "@/store/appStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  ImageIcon,
  Palette,
  Tag,
  FolderTree,
  Heart,
} from "lucide-react"

export default function StatsDashboard() {
  const { images, palettes, tags, groups } = useStore()

  const totalImages = images.length
  const totalPalettes = palettes.length
  const favoriteImages = images.filter((img) => img.isFavorite).length
  const favoritePalettes = palettes.filter((p) => p.isFavorite).length

  const tagUsage = tags
    .map((tag) => {
      const inImages = images.filter((img) =>
        img.tagIds.includes(tag.id)
      ).length
      const inPalettes = palettes.filter((p) =>
        p.tagIds.includes(tag.id)
      ).length
      return { ...tag, count: inImages + inPalettes }
    })
    .sort((a, b) => b.count - a.count)

  const groupUsage = groups
    .map((group) => {
      const inImages = images.filter((img) =>
        img.groupIds.includes(group.id)
      ).length
      const inPalettes = palettes.filter((p) =>
        p.groupIds.includes(group.id)
      ).length
      return { ...group, count: inImages + inPalettes }
    })
    .sort((a, b) => b.count - a.count)

  const statCards = [
    {
      label: "Images",
      value: totalImages,
      icon: ImageIcon,
      color: "text-blue-600 bg-blue-500/10",
    },
    {
      label: "Palettes",
      value: totalPalettes,
      icon: Palette,
      color: "text-violet-600 bg-violet-500/10",
    },
    {
      label: "Favorites",
      value: favoriteImages + favoritePalettes,
      icon: Heart,
      color: "text-rose-600 bg-rose-500/10",
    },
    {
      label: "Tags",
      value: tags.length,
      icon: Tag,
      color: "text-amber-600 bg-amber-500/10",
    },
    {
      label: "Groups",
      value: groups.length,
      icon: FolderTree,
      color: "text-emerald-600 bg-emerald-500/10",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="surface-card">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.color}`}
                >
                  <stat.icon className="h-4 w-4" aria-hidden="true" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {stat.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="surface-card">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold">
              Popular Tags
            </CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {tagUsage.slice(0, 12).map((tag) => (
                <Badge key={tag.id} variant="secondary" className="text-xs">
                  {tag.name}
                  <span className="ml-1 opacity-60">({tag.count})</span>
                </Badge>
              ))}
              {tagUsage.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No tags yet. Add tags when creating images or palettes.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="surface-card">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold">
              Popular Groups
            </CardTitle>
            <FolderTree className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {groupUsage.slice(0, 12).map((group) => (
                <Badge key={group.id} variant="outline" className="text-xs">
                  {group.name}
                  <span className="ml-1 opacity-60">({group.count})</span>
                </Badge>
              ))}
              {groupUsage.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No groups yet. Create groups in the Generator.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="surface-card">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base font-semibold">
            Content Summary
          </CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <p className="text-2xl font-bold">{totalImages + totalPalettes}</p>
              <p className="text-sm text-muted-foreground mt-1">Total items</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <p className="text-2xl font-bold">{favoriteImages}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Favorite images
              </p>
            </div>
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <p className="text-2xl font-bold">{favoritePalettes}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Favorite palettes
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
