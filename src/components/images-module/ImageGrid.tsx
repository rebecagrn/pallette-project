import { ImageProps } from "@/types"
import { useState, useMemo } from "react"
import { useStore } from "@/store/appStore"
import ImageCard from "./ImageCard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Filter, ImageIcon, ImagePlus } from "lucide-react"
import SearchBar from "@/components/shared/SearchBar"
import { EmptyState } from "@/components/shared/EmptyState"

interface ImageGridProps {
  images: ImageProps[]
  onDelete: (id: string) => void
  onEdit: (id: string, data: Partial<ImageProps>) => void
  viewMode?: "grid" | "list"
  onAddClick?: () => void
}

export default function ImageGrid({
  images,
  onDelete,
  onEdit,
  viewMode = "grid",
  onAddClick,
}: ImageGridProps) {
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([])
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const { groups, tags } = useStore()

  const filteredImages = useMemo(() => {
    return images.filter((image) => {
      const matchesGroups =
        selectedGroupIds.length === 0 ||
        selectedGroupIds.some((groupId) => image.groupIds.includes(groupId))
      const matchesTags =
        selectedTagIds.length === 0 ||
        selectedTagIds.some((tagId) => image.tagIds.includes(tagId))
      const matchesSearch =
        searchQuery === "" ||
        image.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        image.comments.some((comment) =>
          comment.text.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        image.tagIds.some((tagId) => {
          const tag = tags.find((t) => t.id === tagId)
          return tag?.name.toLowerCase().includes(searchQuery.toLowerCase())
        })
      return matchesGroups && matchesTags && matchesSearch
    })
  }, [images, selectedGroupIds, selectedTagIds, searchQuery, tags])

  const handleToggleGroup = (groupId: string) => {
    setSelectedGroupIds((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    )
  }

  const handleToggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    )
  }

  const clearFilters = () => {
    setSelectedGroupIds([])
    setSelectedTagIds([])
    setSearchQuery("")
  }

  const hasActiveFilters =
    selectedGroupIds.length > 0 ||
    selectedTagIds.length > 0 ||
    searchQuery.length > 0

  const showFilters = groups.length > 0 || tags.length > 0 || images.length > 0

  return (
    <div className="space-y-4">
      {showFilters && (
        <div className="surface-card p-3 sm:p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <SearchBar
              onSearch={setSearchQuery}
              placeholder="Search images, comments, or tags..."
            />
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="shrink-0 text-muted-foreground"
              >
                Clear
              </Button>
            )}
          </div>

          {(groups.length > 0 || tags.length > 0) && (
            <div className="flex flex-wrap items-center gap-2">
              {groups.map((group) => (
                <Badge
                  key={group.id}
                  variant={
                    selectedGroupIds.includes(group.id) ? "default" : "outline"
                  }
                  className="cursor-pointer select-none py-1 px-2.5"
                  onClick={() => handleToggleGroup(group.id)}
                >
                  {group.name}
                </Badge>
              ))}
              {tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={
                    selectedTagIds.includes(tag.id) ? "default" : "outline"
                  }
                  className="cursor-pointer select-none py-1 px-2.5"
                  onClick={() => handleToggleTag(tag.id)}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}

      {images.length === 0 ? (
        <div className="surface-card">
          <EmptyState
            icon={ImageIcon}
            title="No images yet"
            description="Add a photo to extract colors or generate an AI palette."
            action={
              onAddClick ? (
                <Button onClick={onAddClick}>
                  <ImagePlus className="h-4 w-4" />
                  Add your first image
                </Button>
              ) : undefined
            }
          />
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="surface-card">
          <EmptyState
            icon={Filter}
            title="No matches found"
            description="Try another search or clear your filters."
            action={
              <Button variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
            }
          />
        </div>
      ) : (
        <div
          className={
            viewMode === "list"
              ? "flex flex-col gap-3"
              : "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
          }
        >
          {filteredImages.map((image) => (
            <ImageCard
              key={image.id}
              image={image}
              onDelete={onDelete}
              onEdit={onEdit}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}
    </div>
  )
}
