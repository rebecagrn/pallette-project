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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h2 className="text-lg sm:text-xl font-semibold tracking-tight">
          Your images
        </h2>
        <p className="text-sm text-muted-foreground">
          {totalImages} image{totalImages !== 1 ? "s" : ""} · {groups.length}{" "}
          group{groups.length !== 1 ? "s" : ""} · {tags.length} tag
          {tags.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={sortBy}
          onValueChange={(value: "newest" | "oldest" | "name") =>
            onSortChange(value)
          }
        >
          <SelectTrigger className="w-[140px] sm:w-[160px] h-10 bg-background">
            <SortAsc className="mr-2 h-4 w-4 shrink-0" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="name">Name</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center rounded-lg border bg-background p-1">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("grid")}
            className="h-8 w-8 p-0"
            aria-label="Grid view"
            aria-pressed={viewMode === "grid"}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("list")}
            className="h-8 w-8 p-0"
            aria-label="List view"
            aria-pressed={viewMode === "list"}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>

        <Button onClick={onAddClick} className="shrink-0">
          <ImagePlus className="h-4 w-4" />
          <span className="hidden sm:inline">Add image</span>
        </Button>
      </div>
    </div>
  )
}
