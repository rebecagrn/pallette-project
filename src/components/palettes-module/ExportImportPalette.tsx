import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Download, Upload } from "lucide-react"
import { ColorPaletteProps, CommentProps } from "@/types"
import { useStore } from "@/store/appStore"
import { showSuccessToast, showErrorToast } from "@/lib/toast"
import { parseImportedPalette } from "@/validations/palette"

interface ExportImportPaletteProps {
  palette: ColorPaletteProps
  compact?: boolean
}

export default function ExportImportPalette({
  palette,
  compact = false,
}: ExportImportPaletteProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addPalette, tags, groups } = useStore()

  const handleExport = () => {
    try {
      const exportData = {
        name: palette.name,
        colors: palette.colors,
        tagIds: palette.tagIds,
        groupIds: palette.groupIds,
        comments: palette.comments,
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      })

      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${palette.name
        .toLowerCase()
        .replace(/\s+/g, "-")}-palette.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      showSuccessToast("Palette exported successfully")
    } catch {
      showErrorToast("Failed to export palette")
    }
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return

    const reader = new FileReader()
    reader.onload = (loadEvent) => {
      try {
        const content = loadEvent.target?.result
        if (typeof content !== "string") {
          throw new Error("Invalid palette file")
        }
        const parsed = parseImportedPalette(JSON.parse(content))
        if (!parsed.success) {
          showErrorToast(
            "Failed to import palette. Use a JSON file with a name and hex colors."
          )
          return
        }
        const imported = parsed.data
        const knownTagIds = new Set(tags.map((tag) => tag.id))
        const knownGroupIds = new Set(groups.map((group) => group.id))
        const comments: CommentProps[] = (imported.comments ?? []).map(
          (comment) => ({
            id: crypto.randomUUID(),
            imageId: "",
            text: comment.text,
            createdAt: comment.createdAt ?? new Date().toISOString(),
            updatedAt: comment.updatedAt ?? new Date().toISOString(),
          })
        )
        addPalette({
          name: imported.name || "Imported Palette",
          colors: imported.colors,
          tagIds: (imported.tagIds ?? []).filter((id) => knownTagIds.has(id)),
          groupIds: (imported.groupIds ?? []).filter((id) =>
            knownGroupIds.has(id)
          ),
          comments,
          isFavorite: false,
        })
        showSuccessToast("Palette imported as a new item")
      } catch {
        showErrorToast(
          "Failed to import palette. Please check the file format."
        )
      }
    }

    reader.readAsText(file)
  }

  return (
    <div className="flex gap-0.5">
      <Button
        variant={compact ? "ghost" : "outline"}
        size={compact ? "icon" : "sm"}
        onClick={handleExport}
        className={compact ? "h-8 w-8" : "flex items-center gap-2"}
        aria-label="Export palette"
      >
        <Download className="h-4 w-4" />
        {!compact && "Export"}
      </Button>
      <Button
        variant={compact ? "ghost" : "outline"}
        size={compact ? "icon" : "sm"}
        onClick={() => fileInputRef.current?.click()}
        className={compact ? "h-8 w-8" : "flex items-center gap-2"}
        aria-label="Import palette"
      >
        <Upload className="h-4 w-4" />
        {!compact && "Import"}
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImport}
        accept=".json,application/json"
        className="hidden"
      />
    </div>
  )
}
