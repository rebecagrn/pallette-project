"use client";

import { useStore } from "@/store/appStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  ImageIcon,
  Palette,
  Tag,
  FolderTree,
  Heart,
} from "lucide-react";

export default function StatsDashboard() {
  const { images, palettes, tags, groups } = useStore();

  // Calculate statistics
  const totalImages = images.length;
  const totalPalettes = palettes.length;
  const totalTags = tags.length;
  const totalGroups = groups.length;
  const favoriteImages = images.filter((img) => img.isFavorite).length;
  const favoritePalettes = palettes.filter((p) => p.isFavorite).length;

  // Calculate most used tags
  const tagUsage = tags
    .map((tag) => {
      const inImages = images.filter((img) =>
        img.tagIds.includes(tag.id)
      ).length;
      const inPalettes = palettes.filter((p) =>
        p.tagIds.includes(tag.id)
      ).length;
      return {
        ...tag,
        count: inImages + inPalettes,
      };
    })
    .sort((a, b) => b.count - a.count);

  // Calculate most used groups
  const groupUsage = groups
    .map((group) => {
      const inImages = images.filter((img) =>
        img.groupIds.includes(group.id)
      ).length;
      const inPalettes = palettes.filter((p) =>
        p.groupIds.includes(group.id)
      ).length;
      return {
        ...group,
        count: inImages + inPalettes,
      };
    })
    .sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Content</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  <span>Images</span>
                </div>
                <span className="font-semibold">{totalImages}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  <span>Palettes</span>
                </div>
                <span className="font-semibold">{totalPalettes}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  <span>Favorites</span>
                </div>
                <span className="font-semibold">
                  {favoriteImages + favoritePalettes}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Popular Tags</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {tagUsage.slice(0, 10).map((tag) => (
                <Badge key={tag.id} variant="secondary">
                  {tag.name} ({tag.count})
                </Badge>
              ))}
              {tagUsage.length === 0 && (
                <span className="text-sm text-muted-foreground">
                  No tags yet
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Popular Groups
            </CardTitle>
            <FolderTree className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {groupUsage.slice(0, 10).map((group) => (
                <Badge key={group.id} variant="secondary">
                  {group.name} ({group.count})
                </Badge>
              ))}
              {groupUsage.length === 0 && (
                <span className="text-sm text-muted-foreground">
                  No groups yet
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
