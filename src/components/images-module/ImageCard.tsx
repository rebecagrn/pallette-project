import { ImageProps, CommentProps } from "@/types"
import { useState, memo } from "react"
import { useStore } from "@/store/appStore"
import { Button } from "../ui/button"
import { Trash2, Heart, Palette, Sparkles, Loader2 } from "lucide-react"
import { Textarea } from "../ui/textarea"
import { Badge } from "../ui/badge"
import { Card, CardContent } from "../ui/card"
import CommentSection from "../shared/CommentSection"
import { extractColors } from "@/lib/colorExtractor"
import { generatePaletteWithAi, PaletteApiError } from "@/lib/paletteApi"
import { showSuccessToast, showErrorToast } from "@/lib/toast"
import { cn } from "@/lib/utils"

interface ImageCardProps {
  image: ImageProps
  onDelete: (id: string) => void
  onEdit: (id: string, data: Partial<ImageProps>) => void
}

const ImageCard = memo(function ImageCard({
  image,
  onDelete,
  onEdit,
}: ImageCardProps) {
  const [isEditing] = useState(false)
  const [isExtracting, setIsExtracting] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [comment, setComment] = useState("")
  const { tags, groups, addPalette } = useStore()

  const isBusy = isExtracting || isEnhancing

  const handleAddComment = () => {
    if (!comment.trim()) return
    const newComment: CommentProps = {
      id: crypto.randomUUID(),
      imageId: image.id,
      text: comment,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    onEdit(image.id, {
      comments: [...image.comments, newComment],
    })
    setComment("")
  }

  const handleUpdateComments = (comments: CommentProps[]) => {
    onEdit(image.id, { comments })
  }

  const handleExtractColors = async () => {
    setIsExtracting(true)
    try {
      const colors = await extractColors(image.url)
      const paletteName = `Palette from ${
        image.url.split("/").pop() || "image"
      }`
      addPalette({
        name: paletteName,
        colors,
        tagIds: image.tagIds,
        groupIds: image.groupIds,
        comments: [],
        isFavorite: false,
      })
      showSuccessToast("Palette created from extracted colors")
    } catch {
      showErrorToast("Failed to extract colors from image")
    } finally {
      setIsExtracting(false)
    }
  }

  const handleAiEnhance = async () => {
    setIsEnhancing(true)
    try {
      const baseColors = await extractColors(image.url)
      const imageLabel = image.url.split("/").pop() || "image"
      const response = await generatePaletteWithAi({
        prompt: `Harmonious color palette inspired by this image (${imageLabel})`,
        base_colors: baseColors,
        color_count: 5,
      })
      addPalette({
        name: response.palette.name,
        colors: response.palette.colors,
        tagIds: image.tagIds,
        groupIds: image.groupIds,
        comments: [
          {
            id: crypto.randomUUID(),
            imageId: image.id,
            text: response.palette.description,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        isFavorite: false,
      })
      showSuccessToast(
        response.palette.source === "ai"
          ? "AI palette created from image"
          : "Enhanced palette created from image"
      )
    } catch (error) {
      const message =
        error instanceof PaletteApiError
          ? error.message
          : "Failed to generate AI palette from image"
      showErrorToast(message)
    } finally {
      setIsEnhancing(false)
    }
  }

  return (
    <Card className="surface-card overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={image.url}
            alt="Uploaded image"
            className="object-cover w-full h-full"
            loading="lazy"
          />
          <div className="absolute top-2 right-2 flex gap-1">
            <Button
              variant="secondary"
              size="icon"
              className={cn(
                "h-9 w-9 rounded-full shadow-sm bg-background/90 backdrop-blur-sm",
                image.isFavorite && "text-red-500"
              )}
              aria-label="Toggle favorite"
              onClick={() =>
                onEdit(image.id, { isFavorite: !image.isFavorite })
              }
            >
              <Heart
                className={cn("h-4 w-4", image.isFavorite && "fill-current")}
              />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-9 w-9 rounded-full shadow-sm bg-background/90 backdrop-blur-sm hover:text-destructive"
              aria-label="Delete image"
              onClick={() => onDelete(image.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExtractColors}
              disabled={isBusy}
              className="h-10"
            >
              {isExtracting ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <Palette className="mr-1.5 h-4 w-4" />
              )}
              Extract
            </Button>
            <Button
              size="sm"
              onClick={handleAiEnhance}
              disabled={isBusy}
              className="h-10"
            >
              {isEnhancing ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-1.5 h-4 w-4" />
              )}
              AI Enhance
            </Button>
          </div>

          {(image.groupIds.length > 0 || image.tagIds.length > 0) && (
            <div className="flex flex-wrap gap-1.5">
              {image.groupIds.map((groupId) => {
                const group = groups.find((g) => g.id === groupId)
                return group ? (
                  <Badge key={group.id} variant="default" className="text-xs">
                    {group.name}
                  </Badge>
                ) : null
              })}
              {image.tagIds.map((tagId) => {
                const tag = tags.find((t) => t.id === tagId)
                return tag ? (
                  <Badge key={tag.id} variant="secondary" className="text-xs">
                    {tag.name}
                  </Badge>
                ) : null
              })}
            </div>
          )}

          <CommentSection
            itemId={image.id}
            comments={image.comments}
            onUpdate={handleUpdateComments}
          />

          {isEditing && (
            <div className="space-y-2">
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="min-h-[80px]"
              />
              <Button onClick={handleAddComment} className="w-full">
                Add Comment
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
})

export default ImageCard
