"use client"

import Link from "next/link"
import { useStore } from "@/store/appStore"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/EmptyState"
import { cn } from "@/lib/utils"
import {
  ImageIcon,
  Palette,
  Tag,
  FolderTree,
  Heart,
  Plus,
  Sparkles,
  ArrowRight,
  ImagePlus,
} from "lucide-react"

function formatRelativeDate(isoDate: string): string {
  const timestamp = new Date(isoDate).getTime()
  if (Number.isNaN(timestamp)) return ""
  const diffMs = Date.now() - timestamp
  const days = Math.floor(diffMs / 86400000)
  if (days <= 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 7) return `${days}d ago`
  return new Date(isoDate).toLocaleDateString()
}

export default function StatsDashboard() {
  const { images, palettes, tags, groups } = useStore()

  const totalImages = images.length
  const totalPalettes = palettes.length
  const favoriteImages = images.filter((img) => img.isFavorite).length
  const favoritePalettes = palettes.filter((p) => p.isFavorite).length
  const totalItems = totalImages + totalPalettes
  const totalFavorites = favoriteImages + favoritePalettes
  const favoriteShare =
    totalItems === 0 ? 0 : Math.round((totalFavorites / totalItems) * 100)

  const tagUsage = tags
    .map((tag) => {
      const count =
        images.filter((img) => img.tagIds.includes(tag.id)).length +
        palettes.filter((p) => p.tagIds.includes(tag.id)).length
      return { ...tag, count }
    })
    .sort((a, b) => b.count - a.count)

  const groupUsage = groups
    .map((group) => {
      const count =
        images.filter((img) => img.groupIds.includes(group.id)).length +
        palettes.filter((p) => p.groupIds.includes(group.id)).length
      return { ...group, count }
    })
    .sort((a, b) => b.count - a.count)

  const maxTagCount = Math.max(1, ...tagUsage.map((tag) => tag.count))
  const maxGroupCount = Math.max(1, ...groupUsage.map((group) => group.count))

  const recentPalettes = [...palettes]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 4)

  const recentImages = [...images]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 6)

  const statCards = [
    {
      label: "Images",
      value: totalImages,
      hint: "In your library",
      href: "/generator",
      icon: ImageIcon,
      accent: "from-sky-500/15 to-transparent",
      iconClass: "text-sky-700 bg-sky-500/15",
    },
    {
      label: "Palettes",
      value: totalPalettes,
      hint: "Saved combinations",
      href: "/palettes",
      icon: Palette,
      accent: "from-violet-500/15 to-transparent",
      iconClass: "text-violet-700 bg-violet-500/15",
    },
    {
      label: "Favorites",
      value: totalFavorites,
      hint: `${favoriteShare}% of your library`,
      href: "/palettes",
      icon: Heart,
      accent: "from-rose-500/15 to-transparent",
      iconClass: "text-rose-700 bg-rose-500/15",
    },
    {
      label: "Tags",
      value: tags.length,
      hint: "Used to filter",
      href: "/generator",
      icon: Tag,
      accent: "from-amber-500/15 to-transparent",
      iconClass: "text-amber-700 bg-amber-500/15",
    },
    {
      label: "Groups",
      value: groups.length,
      hint: "Collections",
      href: "/generator",
      icon: FolderTree,
      accent: "from-emerald-500/15 to-transparent",
      iconClass: "text-emerald-700 bg-emerald-500/15",
    },
  ]

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="relative overflow-hidden rounded-2xl border bg-card/90 p-5 sm:p-8 shadow-sm">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--brand-light)/0.18),_transparent_55%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Your library
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {totalItems === 0
                ? "Start building your color library"
                : `${totalItems} item${totalItems === 1 ? "" : "s"} ready to use`}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Extract palettes from photos, generate with AI, and keep everything
              organized in one place.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 shrink-0">
            <Link href="/generator" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto">
                <ImagePlus className="h-4 w-4" />
                Upload image
              </Button>
            </Link>
            <Link href="/palettes" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto bg-background/80">
                <Sparkles className="h-4 w-4" />
                AI generator
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group surface-card relative overflow-hidden p-4 sm:p-5 transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div
              className={cn(
                "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-80",
                stat.accent
              )}
            />
            <div className="relative">
              <div
                className={cn(
                  "mb-4 flex h-10 w-10 items-center justify-center rounded-xl",
                  stat.iconClass
                )}
              >
                <stat.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <p className="text-3xl sm:text-4xl font-bold tabular-nums tracking-tight">
                {stat.value}
              </p>
              <p className="mt-1 text-sm font-medium">{stat.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{stat.hint}</p>
            </div>
          </Link>
        ))}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-5 gap-4 sm:gap-6">
        <div className="surface-card xl:col-span-3 p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold">Recent palettes</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Latest color sets you saved
              </p>
            </div>
            <Link
              href="/palettes"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {recentPalettes.length === 0 ? (
            <EmptyState
              icon={Palette}
              title="No palettes yet"
              description="Create one from an image or generate with AI."
              className="py-10"
              action={
                <Link href="/palettes">
                  <Button size="sm">
                    <Plus className="h-4 w-4" />
                    Create palette
                  </Button>
                </Link>
              }
            />
          ) : (
            <ul className="space-y-3">
              {recentPalettes.map((palette) => (
                <li key={palette.id}>
                  <Link
                    href="/palettes"
                    className="flex items-center gap-3 rounded-xl border bg-background/70 p-2.5 sm:p-3 transition-colors hover:bg-muted/60"
                  >
                    <div className="flex h-11 sm:h-12 w-28 sm:w-36 shrink-0 overflow-hidden rounded-lg">
                      {palette.colors.map((color, index) => (
                        <span
                          key={`${palette.id}-${color}-${index}`}
                          className="flex-1"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{palette.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {palette.colors.length} colors ·{" "}
                        {formatRelativeDate(palette.createdAt)}
                      </p>
                    </div>
                    {palette.isFavorite && (
                      <Heart className="h-4 w-4 shrink-0 fill-current text-rose-500" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="surface-card xl:col-span-2 p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold">Recent images</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Latest uploads
              </p>
            </div>
            <Link
              href="/generator"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Open
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {recentImages.length === 0 ? (
            <EmptyState
              icon={ImageIcon}
              title="No images yet"
              description="Upload a photo to extract colors."
              className="py-10"
              action={
                <Link href="/generator">
                  <Button size="sm" variant="outline">
                    <ImagePlus className="h-4 w-4" />
                    Upload
                  </Button>
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {recentImages.map((image) => (
                <Link
                  key={image.id}
                  href="/generator"
                  className="group relative aspect-square overflow-hidden rounded-xl bg-muted"
                >
                  <img
                    src={image.url}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {image.isFavorite && (
                    <Heart className="absolute top-1.5 right-1.5 h-3.5 w-3.5 fill-current text-white drop-shadow" />
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <UsageList
          title="Popular tags"
          emptyTitle="No tags yet"
          emptyDescription="Add tags when creating images or palettes."
          items={tagUsage.slice(0, 8)}
          maxCount={maxTagCount}
          barClass="bg-primary"
        />
        <UsageList
          title="Popular groups"
          emptyTitle="No groups yet"
          emptyDescription="Create groups in the Generator."
          items={groupUsage.slice(0, 8)}
          maxCount={maxGroupCount}
          barClass="bg-accent"
        />
      </section>
    </div>
  )
}

interface UsageListProps {
  title: string
  emptyTitle: string
  emptyDescription: string
  items: { id: string; name: string; count: number }[]
  maxCount: number
  barClass: string
}

function UsageList({
  title,
  emptyTitle,
  emptyDescription,
  items,
  maxCount,
  barClass,
}: UsageListProps) {
  return (
    <div className="surface-card p-5 sm:p-6">
      <h3 className="font-semibold mb-4">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground py-6">{emptyDescription}</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => {
            const width = Math.max(8, Math.round((item.count / maxCount) * 100))
            return (
              <li key={item.id} className="space-y-1.5">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium truncate">{item.name}</span>
                  <span className="tabular-nums text-muted-foreground shrink-0">
                    {item.count}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", barClass)}
                    style={{ width: `${width}%` }}
                  />
                </div>
              </li>
            )
          })}
        </ul>
      )}
      {items.length === 0 && (
        <span className="sr-only">{emptyTitle}</span>
      )}
    </div>
  )
}
