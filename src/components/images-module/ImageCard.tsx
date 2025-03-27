import { ImageProps, CommentProps } from "@/types";
import { useState } from "react";
import { useStore } from "@/store/appStore";
import { Button } from "../ui/button";
import Image from "next/image";
import {
  Check,
  Pencil,
  Star,
  StarOff,
  Trash2,
  MessageSquare,
} from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";

interface ImageCardProps {
  image: ImageProps;
  onDelete: (id: string) => void;
  onEdit: (id: string, data: Partial<ImageProps>) => void;
}

export default function ImageCard({ image, onDelete, onEdit }: ImageCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [comment, setComment] = useState("");
  const { tags, groups } = useStore();

  const handleAddComment = () => {
    if (!comment.trim()) return;
    const newComment: CommentProps = {
      id: crypto.randomUUID(),
      imageId: image.id,
      text: comment,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onEdit(image.id, {
      comments: [...image.comments, newComment],
    });
    setComment("");
  };

  const handleToggleFavorite = () => {
    onEdit(image.id, {
      isFavorite: !image.isFavorite,
    });
  };

  return (
    <Card className="group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-gradient-to-bl from-purple-500/20 to-transparent rounded-full transform translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-gradient-to-tr from-blue-500/20 to-transparent rounded-full transform -translate-x-1/2 translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative aspect-square">
        <Image
          src={image.url}
          alt="Reference"
          className="object-cover transition-transform group-hover:scale-105"
          fill
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
          >
            {isEditing ? (
              <Check className="h-4 w-4" />
            ) : (
              <MessageSquare className="h-4 w-4" />
            )}
          </Button>
          <Button
            onClick={() => onDelete(image.id)}
            variant="destructive"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CardContent className="relative space-y-4 p-4">
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

        {image.comments.length > 0 && (
          <div className="space-y-2">
            {image.comments.map((comment) => (
              <div key={comment.id} className="text-sm text-muted-foreground">
                {comment.text}
              </div>
            ))}
          </div>
        )}

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
