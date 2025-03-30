import { ColorPaletteProps, CommentProps } from "@/types";
import { useStore } from "@/store/appStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Heart } from "lucide-react";
import CommentSection from "../shared/CommentSection";
import ExportImportPalette from "./ExportImportPalette";

interface PaletteCardProps {
  palette: ColorPaletteProps;
  onDelete: (id: string) => void;
  onEdit: (id: string, data: Partial<ColorPaletteProps>) => void;
}

export default function PaletteCard({
  palette,
  onDelete,
  onEdit,
}: PaletteCardProps) {
  const { tags } = useStore();
  const { toast } = useToast();

  const handleToggleFavorite = () => {
    onEdit(palette.id, {
      isFavorite: !palette.isFavorite,
    });
    toast({
      title: "Success",
      description: palette.isFavorite
        ? "Removed from favorites"
        : "Added to favorites",
    });
  };

  const handleUpdateComments = (comments: CommentProps[]) => {
    onEdit(palette.id, { comments });
  };

  return (
    <Card className="group relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <h3 className="font-semibold leading-none">{palette.name}</h3>
          <p className="text-sm text-muted-foreground">
            {palette.colors.length} colors
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleFavorite}
            className={`h-8 w-8 ${
              palette.isFavorite ? "text-red-500" : "text-muted-foreground"
            }`}
          >
            <Heart
              className={`h-4 w-4 ${palette.isFavorite ? "fill-current" : ""}`}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(palette.id)}
            className="h-8 w-8 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex h-24 rounded-lg overflow-hidden mb-4">
          {palette.colors.map((color, index) => (
            <div
              key={index}
              className="flex-1 relative group"
              style={{ backgroundColor: color }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-mono">
                  {color}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {palette.tagIds.map((tagId) => {
            const tag = tags.find((t) => t.id === tagId);
            return tag ? (
              <Badge key={tag.id} variant="secondary">
                {tag.name}
              </Badge>
            ) : null;
          })}
        </div>

        <div className="mb-4">
          <ExportImportPalette
            palette={palette}
            onImport={(data) => onEdit(palette.id, data)}
          />
        </div>

        <CommentSection
          itemId={palette.id}
          comments={palette.comments}
          onUpdate={handleUpdateComments}
        />
      </CardContent>
    </Card>
  );
}
