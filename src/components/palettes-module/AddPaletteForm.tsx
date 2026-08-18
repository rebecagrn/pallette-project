import { useState } from "react"
import { useStore } from "@/store/appStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { showSuccessToast, showErrorToast } from "@/lib/toast"

interface AddPaletteFormProps {
  onSuccess?: () => void
}

export default function AddPaletteForm({ onSuccess }: AddPaletteFormProps) {
  const [name, setName] = useState("")
  const [colors, setColors] = useState<string[]>([])
  const [newColor, setNewColor] = useState("#2E8BC0")
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const { addPalette, tags, addTag } = useStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      showErrorToast("Please enter a palette name")
      return
    }
    if (colors.length === 0) {
      showErrorToast("Please add at least one color")
      return
    }
    addPalette({
      name,
      colors,
      tagIds: selectedTagIds,
      groupIds: [],
      comments: [],
      isFavorite: false,
    })
    showSuccessToast("Palette created successfully")
    setName("")
    setColors([])
    setSelectedTagIds([])
    setTagInput("")
    onSuccess?.()
  }

  const handleAddColor = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newColor.trim()) return
    setColors([...colors, newColor.toUpperCase()])
  }

  const handleRemoveColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index))
  }

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault()
    if (!tagInput.trim()) return
    const newTagName = tagInput.trim()
    const existingTag = tags.find(
      (tag) => tag.name.toLowerCase() === newTagName.toLowerCase()
    )
    if (existingTag) {
      if (!selectedTagIds.includes(existingTag.id)) {
        setSelectedTagIds([...selectedTagIds, existingTag.id])
        setTagInput("")
      } else {
        showErrorToast("This tag is already added to the palette")
      }
      return
    }
    const newTagId = addTag(newTagName)
    setSelectedTagIds([...selectedTagIds, newTagId])
    setTagInput("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {colors.length > 0 && (
        <div className="flex h-14 overflow-hidden rounded-xl border">
          {colors.map((color, index) => (
            <div
              key={`${color}-${index}`}
              className="flex-1"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Palette name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Sunset brand kit"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Colors</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            className="w-14 h-10 p-1 cursor-pointer"
            aria-label="Pick a color"
          />
          <Input
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            placeholder="#2E8BC0"
            className="font-mono uppercase"
          />
          <Button type="button" onClick={handleAddColor} variant="secondary">
            Add
          </Button>
        </div>
        {colors.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {colors.map((color, index) => (
              <button
                key={`${color}-${index}`}
                type="button"
                onClick={() => handleRemoveColor(index)}
                className="flex items-center gap-2 rounded-full border bg-background px-2.5 py-1 text-xs font-mono hover:border-destructive"
                aria-label={`Remove ${color}`}
              >
                <span
                  className="h-3 w-3 rounded-full border"
                  style={{ backgroundColor: color }}
                />
                {color}
                <span className="text-muted-foreground">×</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <div className="flex gap-2">
          <Input
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTag(e)}
            placeholder="Add tags"
            className="flex-1"
          />
          <Button type="button" onClick={handleAddTag} variant="secondary">
            Add
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag.id}
                variant={
                  selectedTagIds.includes(tag.id) ? "default" : "outline"
                }
                className="cursor-pointer"
                onClick={() => {
                  setSelectedTagIds((current) =>
                    current.includes(tag.id)
                      ? current.filter((id) => id !== tag.id)
                      : [...current, tag.id]
                  )
                }}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <Button type="submit" className="w-full">
        Create palette
      </Button>
    </form>
  )
}
