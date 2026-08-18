import { useState, useRef } from "react"
import { useStore } from "@/store/appStore"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload } from "lucide-react"
import { showSuccessToast, showErrorToast } from "@/lib/toast"

interface AddImageFormProps {
  onSuccess?: () => void
}

export default function AddImageForm({ onSuccess }: AddImageFormProps) {
  const [url, setUrl] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addImage, tags, groups, addTag } = useStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) {
      showErrorToast("Please enter an image URL")
      return
    }

    addImage({
      url,
      tagIds: selectedTags,
      groupIds: selectedGroups,
      comments: [],
      isFavorite: false,
    })

    setUrl("")
    setSelectedTags([])
    setSelectedGroups([])
    setTagInput("")
    onSuccess?.()
    showSuccessToast("Image added successfully")
  }

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      showErrorToast("Please upload an image file")
      return
    }
    setIsUploading(true)
    try {
      const imageUrl = URL.createObjectURL(file)
      setUrl(imageUrl)
      showSuccessToast("Image ready to add")
    } catch {
      showErrorToast("Failed to upload image")
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault()
    if (!tagInput.trim()) return
    const newTagName = tagInput.trim()
    const existingTag = tags.find(
      (tag) => tag.name.toLowerCase() === newTagName.toLowerCase()
    )
    if (existingTag) {
      if (!selectedTags.includes(existingTag.id))
        setSelectedTags([...selectedTags, existingTag.id])
    } else {
      const newTagId = addTag(newTagName)
      setSelectedTags([...selectedTags, newTagId])
    }
    setTagInput("")
  }

  const handleToggleGroup = (groupId: string) => {
    setSelectedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="url">Image URL</Label>
        <div className="flex gap-2">
          <Input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://…"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            className="shrink-0"
            aria-label="Upload image file"
          >
            <Upload className="h-4 w-4" />
          </Button>
        </div>
        <Input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          className="hidden"
        />
      </div>

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`w-full rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/40"
        }`}
      >
        {url ? (
          <div className="mx-auto max-w-[180px] aspect-square overflow-hidden rounded-lg bg-muted">
            <img
              src={url}
              alt="Preview"
              className="object-cover w-full h-full"
              onError={(event) => {
                event.currentTarget.style.display = "none"
              }}
            />
          </div>
        ) : (
          <div className="space-y-1">
            <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
            <p className="text-sm font-medium">Drop an image here</p>
            <p className="text-xs text-muted-foreground">or click to browse</p>
          </div>
        )}
      </button>

      <div className="space-y-2">
        <Label>Groups</Label>
        {groups.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Create one in the sidebar first.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {groups.map((group) => (
              <Badge
                key={group.id}
                variant={
                  selectedGroups.includes(group.id) ? "default" : "outline"
                }
                className="cursor-pointer"
                onClick={() => handleToggleGroup(group.id)}
              >
                {group.name}
              </Badge>
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
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), handleAddTag(e))
            }
            placeholder="Add tags"
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
                variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => {
                  setSelectedTags((prev) =>
                    prev.includes(tag.id)
                      ? prev.filter((id) => id !== tag.id)
                      : [...prev, tag.id]
                  )
                }}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isUploading || !url.trim()}
      >
        {isUploading ? "Uploading..." : "Add Image"}
      </Button>
    </form>
  )
}
