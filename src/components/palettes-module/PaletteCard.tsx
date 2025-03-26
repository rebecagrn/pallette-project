import { ColorPaletteProps } from "@/types";
import { useState } from "react";
import { useStore } from "@/store/appStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Star, StarOff, Pencil, Trash2 } from "lucide-react";

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
  const [isEditing, setIsEditing] = useState(false);
  const [comment, setComment] = useState("");
  const { tags } = useStore();
  const { toast } = useToast();

  const handleAddComment = () => {
    if (!comment.trim()) return;
    onEdit(palette.id, {
      comments: [
        ...palette.comments,
        { id: crypto.randomUUID(), text: comment, createdAt: new Date() },
      ],
    });
    setComment("");
    toast({
      title: "Success",
      description: "Comment added successfully!",
    });
  };

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

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">{palette.name}</CardTitle>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleFavorite}
            className="h-8 w-8"
          >
            {palette.isFavorite ? (
              <Star className="h-4 w-4 text-yellow-500" />
            ) : (
              <StarOff className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(!isEditing)}
            className="h-8 w-8"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(palette.id)}
            className="h-8 w-8 text-destructive"
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
                <span className="text-white opacity-0 group-hover:opacity-100 text-sm">
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

        <div className="space-y-2">
          {palette.comments.map((comment) => (
            <div key={comment.id} className="text-sm text-muted-foreground">
              {comment.text}
            </div>
          ))}
        </div>

        {isEditing && (
          <div className="mt-4 space-y-2">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
            />
            <Button onClick={handleAddComment} className="w-full">
              Add Comment
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
