import { ImageProps } from "@/types"
import { useState, useMemo } from "react"
import { useStore } from "@/store/appStore"
import ImageCard from "./ImageCard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Filter, ImageIcon } from "lucide-react"
import SearchBar from "@/components/shared/SearchBar"
import { EmptyState } from "@/components/shared/EmptyState"

interface ImageGridProps {
  images: ImageProps[]
  onDelete: (id: string) => void
  onEdit: (id: string, data: Partial<ImageProps>) => void
}

export default function ImageGrid({
  images,
  onDelete,
  onEdit,
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

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card className="surface-card p-4 sm:p-5">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" />
              <span className="font-semibold text-sm sm:text-base">Filters</span>
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground h-8"
              >
                Clear all
              </Button>
            )}
          </div>

          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Search by name, comment, or tag..."
          />

          {groups.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Groups
              </span>
              <div className="flex flex-wrap gap-2">
                {groups.map((group) => (
                  <Badge
                    key={group.id}
                    variant={
                      selectedGroupIds.includes(group.id)
                        ? "default"
                        : "outline"
                    }
                    className="cursor-pointer select-none py-1.5 px-3"
                    onClick={() => handleToggleGroup(group.id)}
                  >
                    {group.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {tags.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Tags
              </span>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={
                      selectedTagIds.includes(tag.id) ? "default" : "outline"
                    }
                    className="cursor-pointer select-none py-1.5 px-3"
                    onClick={() => handleToggleTag(tag.id)}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {images.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="No images yet"
          description="Upload your first image to start extracting and generating color palettes."
        />
      ) : filteredImages.length === 0 ? (
        <EmptyState
          icon={Filter}
          title="No matches found"
          description="Try adjusting your filters or search query."
          action={
            <Button variant="outline" onClick={clearFilters}>
              Clear filters
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredImages.map((image) => (
            <ImageCard
              key={image.id}
              image={image}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </div>
  )
}
