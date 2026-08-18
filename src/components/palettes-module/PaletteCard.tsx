import { useState } from "react"
import { ColorPaletteProps } from "@/types"
import { useStore } from "@/store/appStore"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Heart, Copy, ChevronDown } from "lucide-react"
import CommentSection from "../shared/CommentSection"
import ExportImportPalette from "./ExportImportPalette"
import { showSuccessToast, showErrorToast } from "@/lib/toast"
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
  const [showNotes, setShowNotes] = useState(false)

  const handleToggleFavorite = () => {
    onEdit(palette.id, { isFavorite: !palette.isFavorite })
    showSuccessToast(
      palette.isFavorite ? "Removed from favorites" : "Added to favorites"
    )
  }

  const handleCopyColor = async (color: string) => {
    try {
      await navigator.clipboard.writeText(color)
      showSuccessToast(`Copied ${color}`)
    } catch {
      showErrorToast("Could not copy color")
    }
  }

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(palette.colors.join(", "))
      showSuccessToast("All colors copied")
    } catch {
      showErrorToast("Could not copy colors")
    }
  }

  return (
    <article className="surface-card overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5 group">
      <div className="flex h-24 sm:h-28">
        {palette.colors.map((color, index) => (
          <button
            key={`${color}-${index}`}
            type="button"
            className="flex-1 relative min-w-0 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            style={{ backgroundColor: color }}
            onClick={() => handleCopyColor(color)}
            aria-label={`Copy color ${color}`}
          >
            <span className="absolute bottom-1.5 left-1 right-1 text-[10px] font-mono text-white/95 drop-shadow-sm truncate opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              {color}
            </span>
          </button>
        ))}
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold leading-tight truncate">
              {palette.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {palette.colors.length} colors · tap a swatch to copy
            </p>
          </div>
          <div className="flex items-center shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyAll}
              className="h-8 w-8"
              aria-label="Copy all colors"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <ExportImportPalette palette={palette} compact />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleFavorite}
              className={cn(
                "h-8 w-8",
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
              className="h-8 w-8 hover:text-destructive"
              aria-label="Delete palette"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {palette.tagIds.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {palette.tagIds.map((tagId) => {
              const tag = tags.find((item) => item.id === tagId)
              return tag ? (
                <Badge key={tag.id} variant="secondary" className="text-xs">
                  {tag.name}
                </Badge>
              ) : null
            })}
          </div>
        )}

        <button
          type="button"
          onClick={() => setShowNotes((open) => !open)}
          className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 transition-transform",
              showNotes && "rotate-180"
            )}
          />
          Notes
          {palette.comments.length > 0 && (
            <span className="tabular-nums">({palette.comments.length})</span>
          )}
        </button>

        {showNotes && (
          <CommentSection
            itemId={palette.id}
            comments={palette.comments}
            onUpdate={(comments) => onEdit(palette.id, { comments })}
          />
        )}
      </div>
    </article>
  )
}
