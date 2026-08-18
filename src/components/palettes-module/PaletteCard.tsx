import { ColorPaletteProps } from "@/types"
import { useStore } from "@/store/appStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Heart, Copy } from "lucide-react"
import CommentSection from "../shared/CommentSection"
import ExportImportPalette from "./ExportImportPalette"
import { showSuccessToast } from "@/lib/toast"
import { cn } from "@/lib/utils"

interface PaletteCardProps {
  palette: ColorPaletteProps
  onDelete: (id: string) => void
  onEdit: (id: string, data: Partial<ColorPaletteProps>) => void
}

export default function PaletteCard({
  palette,
  onDelete,
  onEdit,
}: PaletteCardProps) {
  const { tags } = useStore()

  const handleToggleFavorite = () => {
    onEdit(palette.id, { isFavorite: !palette.isFavorite })
    showSuccessToast(
      palette.isFavorite ? "Removed from favorites" : "Added to favorites"
    )
  }

  const handleCopyColor = (color: string) => {
    navigator.clipboard.writeText(color)
    showSuccessToast(`Copied ${color}`)
  }

  const handleCopyAll = () => {
    navigator.clipboard.writeText(palette.colors.join(", "))
    showSuccessToast("All colors copied")
  }

  return (
    <Card className="surface-card overflow-hidden transition-shadow hover:shadow-md group">
      <div className="flex h-20 sm:h-24">
        {palette.colors.map((color, index) => (
          <button
            key={`${color}-${index}`}
            type="button"
            className="flex-1 relative min-w-0 transition-transform hover:scale-y-105 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            style={{ backgroundColor: color }}
            onClick={() => handleCopyColor(color)}
            aria-label={`Copy color ${color}`}
          >
            <span className="absolute bottom-1 left-1 right-1 text-[9px] sm:text-[10px] font-mono text-white bg-black/40 rounded px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity truncate">
              {color}
            </span>
          </button>
        ))}
      </div>

      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 pt-4 px-4">
        <div className="space-y-0.5 min-w-0 flex-1 pr-2">
          <h3 className="font-semibold leading-tight truncate">
            {palette.name}
          </h3>
          <p className="text-xs text-muted-foreground">
            {palette.colors.length} colors · tap swatch to copy
          </p>
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopyAll}
            className="h-9 w-9"
            aria-label="Copy all colors"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleFavorite}
            className={cn(
              "h-9 w-9",
              palette.isFavorite ? "text-red-500" : "text-muted-foreground"
            )}
            aria-label="Toggle favorite"
          >
            <Heart
              className={cn("h-4 w-4", palette.isFavorite && "fill-current")}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              onDelete(palette.id)
              showSuccessToast("Palette deleted")
            }}
            className="h-9 w-9 hover:text-destructive"
            aria-label="Delete palette"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4 pt-0 space-y-3">
        {palette.tagIds.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {palette.tagIds.map((tagId) => {
              const tag = tags.find((t) => t.id === tagId)
              return tag ? (
                <Badge key={tag.id} variant="secondary" className="text-xs">
                  {tag.name}
                </Badge>
              ) : null
            })}
          </div>
        )}

        <ExportImportPalette
          palette={palette}
          onImport={(data) => onEdit(palette.id, data)}
        />

        <CommentSection
          itemId={palette.id}
          comments={palette.comments}
          onUpdate={(comments) => onEdit(palette.id, { comments })}
        />
      </CardContent>
    </Card>
  )
}
