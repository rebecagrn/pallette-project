import { useStore } from "@/store/appStore"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ImagePlus, Grid, List, SortAsc } from "lucide-react"

interface ImagesHeaderProps {
  totalImages: number
  onAddClick: () => void
  viewMode: "grid" | "list"
  onViewModeChange: (mode: "grid" | "list") => void
  sortBy: "newest" | "oldest" | "name"
  onSortChange: (sort: "newest" | "oldest" | "name") => void
}

export default function ImagesHeader({
  totalImages,
  onAddClick,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
}: ImagesHeaderProps) {
  const { groups, tags } = useStore()

  return (
    <div className="surface-card p-4 sm:p-5 mb-4 sm:mb-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1 min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Your Images
          </h2>
          <p className="text-sm text-muted-foreground">
            {totalImages} image{totalImages !== 1 ? "s" : ""} · {groups.length}{" "}
            group{groups.length !== 1 ? "s" : ""} · {tags.length} tag
            {tags.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Select
            value={sortBy}
            onValueChange={(value: "newest" | "oldest" | "name") =>
              onSortChange(value)
            }
          >
            <SelectTrigger className="w-full sm:w-[160px]">
              <SortAsc className="mr-2 h-4 w-4 shrink-0" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border bg-muted/50 p-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange("grid")}
                className="h-9 w-9 p-0"
                aria-label="Grid view"
                aria-pressed={viewMode === "grid"}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange("list")}
                className="h-9 w-9 p-0"
                aria-label="List view"
                aria-pressed={viewMode === "list"}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            <Button onClick={onAddClick} className="flex-1 sm:flex-none">
              <ImagePlus className="mr-2 h-4 w-4" />
              <span className="sm:inline">Add Image</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
