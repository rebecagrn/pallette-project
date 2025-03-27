import { ImageProps } from "@/types";
import { useState } from "react";
import { useStore } from "@/store/appStore";
import ImageCard from "./ImageCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Filter } from "lucide-react";

interface ImageGridProps {
  images: ImageProps[];
  onDelete: (id: string) => void;
  onEdit: (id: string, data: Partial<ImageProps>) => void;
}

export default function ImageGrid({
  images,
  onDelete,
  onEdit,
}: ImageGridProps) {
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const { groups, tags } = useStore();

  const filteredImages = images.filter((image) => {
    const matchesGroups =
      selectedGroupIds.length === 0 ||
      selectedGroupIds.some((groupId) => image.groupIds.includes(groupId));
    const matchesTags =
      selectedTagIds.length === 0 ||
      selectedTagIds.some((tagId) => image.tagIds.includes(tagId));
    return matchesGroups && matchesTags;
  });

  const handleToggleGroup = (groupId: string) => {
    setSelectedGroupIds((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleToggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const clearFilters = () => {
    setSelectedGroupIds([]);
    setSelectedTagIds([]);
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-bl from-purple-500/20 to-transparent rounded-full transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-tr from-blue-500/20 to-transparent rounded-full transform -translate-x-1/2 translate-y-1/2" />

        <div className="relative space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="font-semibold">Filters</span>
            </div>
            {(selectedGroupIds.length > 0 || selectedTagIds.length > 0) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Clear filters
              </Button>
            )}
          </div>

          {groups.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm font-medium">Groups</span>
              <div className="flex flex-wrap gap-2">
                {groups.map((group) => (
                  <Badge
                    key={group.id}
                    variant={
                      selectedGroupIds.includes(group.id)
                        ? "default"
                        : "outline"
                    }
                    className="cursor-pointer hover:bg-primary/90"
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
              <span className="text-sm font-medium">Tags</span>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={
                      selectedTagIds.includes(tag.id) ? "default" : "outline"
                    }
                    className="cursor-pointer hover:bg-primary/90"
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredImages.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
        {filteredImages.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No images match the selected filters
          </div>
        )}
      </div>
    </div>
  );
}
