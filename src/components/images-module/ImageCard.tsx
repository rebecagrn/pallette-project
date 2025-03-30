import { ImageProps, CommentProps } from "@/types";
import { useState } from "react";
import { useStore } from "@/store/appStore";
import { Button } from "../ui/button";
import Image from "next/image";
import { Check, Trash2, MessageSquare, Heart, Palette } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader } from "../ui/card";
import CommentSection from "../shared/CommentSection";
import { extractColors } from "@/lib/colorExtractor";
import { showSuccessToast, showErrorToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

interface ImageCardProps {
  image: ImageProps;
  onDelete: (id: string) => void;
  onEdit: (updatedImage: ImageProps) => void;
}

export default function ImageCard({ image, onDelete, onEdit }: ImageCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [comment, setComment] = useState("");
  const { tags, groups, addPalette } = useStore();

  const handleAddComment = () => {
    if (!comment.trim()) return;
    const newComment: CommentProps = {
      id: crypto.randomUUID(),
      imageId: image.id,
      text: comment,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onEdit({
      ...image,
      comments: [...image.comments, newComment],
    });
    setComment("");
  };

  const handleUpdateComments = (comments: CommentProps[]) => {
    onEdit({
      ...image,
      comments,
    });
  };

  const handleExtractColors = async () => {
    setIsExtracting(true);
    try {
      const colors = await extractColors(image.url);
      const paletteName = `Palette from ${
        image.url.split("/").pop() || "image"
      }`;

      addPalette({
        name: paletteName,
        colors,
        tagIds: image.tagIds,
        groupIds: image.groupIds,
        comments: [],
        isFavorite: false,
      });

      showSuccessToast("Colors extracted and palette created successfully");
    } catch (error) {
      showErrorToast("Failed to extract colors from image");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleToggleFavorite = () => {
    onEdit({
      ...image,
      isFavorite: !image.isFavorite,
    });
  };

  return (
    <Card className="group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-gradient-to-bl from-purple-500/20 to-transparent rounded-full transform translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-gradient-to-tr from-blue-500/20 to-transparent rounded-full transform -translate-x-1/2 translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "text-muted-foreground",
              image.isFavorite && "text-red-500"
            )}
            aria-label="Toggle favorite"
            onClick={handleToggleFavorite}
          >
            <Heart className={cn(image.isFavorite && "fill-current")} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleExtractColors}
            disabled={isExtracting}
            className="h-8 w-8"
          >
            <Palette className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:text-destructive"
            aria-label="Delete image"
            onClick={() => onDelete(image.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4 p-4">
        <div className="relative aspect-square overflow-hidden rounded-lg">
          <img
            src={image.url}
            alt="Uploaded image"
            className="object-cover w-full h-full"
          />
        </div>

        {image.groupIds.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {image.groupIds.map((groupId) => {
              const group = groups.find((g) => g.id === groupId);
              return group ? (
                <Badge key={group.id} variant="default">
                  {group.name}
                </Badge>
              ) : null;
            })}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {image.tagIds.map((tagId) => {
            const tag = tags.find((t) => t.id === tagId);
            return tag ? (
              <Badge
                key={tag.id}
                variant="secondary"
                className="bg-white/10 hover:bg-white/20"
              >
                {tag.name}
              </Badge>
            ) : null;
          })}
        </div>

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
              className="min-h-[80px] bg-background/60 backdrop-blur-sm"
            />
            <Button
              onClick={handleAddComment}
              className="w-full bg-black hover:bg-slate-950"
            >
              Add Comment
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
