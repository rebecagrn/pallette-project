import { ColorPalette } from "@/types";
import { useState } from "react";
import { useStore } from "@/store/appStore";

interface PaletteCardProps {
  palette: ColorPalette;
  onDelete: (id: string) => void;
  onEdit: (id: string, data: Partial<ColorPalette>) => void;
}

export default function PaletteCard({
  palette,
  onDelete,
  onEdit,
}: PaletteCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [comment, setComment] = useState("");
  const { tags, groups } = useStore();

  const handleAddComment = () => {
    if (!comment.trim()) return;
    onEdit(palette.id, {
      comments: [
        ...palette.comments,
        { id: crypto.randomUUID(), text: comment, createdAt: new Date() },
      ],
    });
    setComment("");
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">{palette.name}</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              {isEditing ? "✓" : "✎"}
            </button>
            <button
              onClick={() => onDelete(palette.id)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              ×
            </button>
          </div>
        </div>

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

        <div className="flex flex-wrap gap-2 mb-2">
          {palette.tagIds.map((tagId) => {
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
          {palette.comments.map((comment) => (
            <div key={comment.id} className="text-sm text-gray-600">
              {comment.text}
            </div>
          ))}
        </div>

        {isEditing && (
          <div className="mt-4 space-y-2">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full p-2 border rounded-md text-sm"
            />
            <button
              onClick={handleAddComment}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
              Add Comment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
