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
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative aspect-square">
        <Image
          src={image.url}
          alt="Reference"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <Button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
          >
            {isEditing ? <Check /> : <Pencil />}
          </Button>
          <Button
            onClick={() => onDelete(image.id)}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
          >
            ×
          </Button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-wrap gap-2 mb-2">
          {image.tagIds.map((tagId) => {
            const tag = tags.find((t) => t.id === tagId);
            return tag ? (
              <span
                key={tag.id}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {tag.name}
              </span>
            ) : null;
          })}
        </div>

        <div className="space-y-2">
          {image.comments.map((comment) => (
            <div key={comment.id} className="text-sm text-gray-600">
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
              className="w-full p-2 border rounded-md text-sm"
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
