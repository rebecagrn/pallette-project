import { useStore } from "@/store/appStore";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImagePlus, Grid, List, SortAsc } from "lucide-react";

interface ImagesHeaderProps {
  totalImages: number;
  onAddClick: () => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  sortBy: "newest" | "oldest" | "name";
  onSortChange: (sort: "newest" | "oldest" | "name") => void;
}

export default function ImagesHeader({
  totalImages,
  onAddClick,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
}: ImagesHeaderProps) {
  const { groups, tags } = useStore();

  return (
    <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between p-4 bg-background/60 backdrop-blur-sm rounded-lg border mb-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Images</h2>
        <p className="text-sm text-muted-foreground">
          {totalImages} image{totalImages !== 1 ? "s" : ""} • {groups.length}{" "}
          group
          {groups.length !== 1 ? "s" : ""} • {tags.length} tag
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
          <SelectTrigger className="w-[160px]">
            <SortAsc className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
            <SelectItem value="name">Name</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center rounded-md border bg-muted p-1">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("grid")}
            className="h-8 w-8 p-0"
          >
            <Grid className="h-4 w-4" />
            <span className="sr-only">Grid view</span>
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("list")}
            className="h-8 w-8 p-0"
          >
            <List className="h-4 w-4" />
            <span className="sr-only">List view</span>
          </Button>
        </div>

        <Button onClick={onAddClick} className="bg-black hover:bg-slate-950">
          <ImagePlus className="mr-2 h-4 w-4" />
          Add Image
        </Button>
      </div>
    </div>
  );
}
