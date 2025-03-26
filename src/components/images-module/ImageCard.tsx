import { ImageProps, CommentProps } from "@/types";
import { useState } from "react";
import { useStore } from "@/store/appStore";
import { Button } from "../ui/button";
import Image from "next/image";
import { Check, Pencil } from "lucide-react";
import { Textarea } from "../ui/textarea";

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
      text: comment,
      createdAt: new Date(),
    };
    onEdit(image.id, {
      comments: [...image.comments, newComment],
    });
    setComment("");
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="relative aspect-square">
        <Image src={image.url} alt="Reference" className="object-cover" fill />
        <div className="absolute top-2 right-2 flex gap-2">
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full"
          >
            {isEditing ? (
              <Check className="h-4 w-4" />
            ) : (
              <Pencil className="h-4 w-4" />
            )}
          </Button>
          <Button
            onClick={() => onDelete(image.id)}
            variant="destructive"
            size="icon"
            className="h-8 w-8 rounded-full"
          >
            ×
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex flex-wrap gap-2">
          {image.tagIds.map((tagId) => {
            const tag = tags.find((t) => t.id === tagId);
            return tag ? (
              <span
                key={tag.id}
                className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                {tag.name}
              </span>
            ) : null;
          })}
        </div>

        <div className="space-y-2">
          {image.comments.map((comment) => (
            <div key={comment.id} className="text-sm text-muted-foreground">
              {comment.text}
            </div>
          ))}
        </div>

        {isEditing && (
          <div className="space-y-4">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="min-h-[100px]"
            />
            <Button onClick={handleAddComment} className="w-full">
              Add Comment
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
