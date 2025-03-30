import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CommentProps } from "@/types";
import { Check, MessageSquare, Pencil, X } from "lucide-react";
import { stringTrimToDots } from "@/lib/utils";
import { showSuccessToast } from "@/lib/toast";
interface CommentSectionProps {
  itemId: string;
  comments: CommentProps[];
  onUpdate: (comments: CommentProps[]) => void;
}

export default function CommentSection({
  itemId,
  comments,
  onUpdate,
}: CommentSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState("");

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: CommentProps = {
      id: crypto.randomUUID(),
      imageId: itemId,
      text: newComment.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onUpdate([...comments, comment]);
    setNewComment("");
    showSuccessToast("Comment added successfully");
  };

  const handleEditComment = (commentId: string) => {
    const comment = comments.find((c) => c.id === commentId);
    if (comment) {
      setEditingCommentId(commentId);
      setEditedText(comment.text);
    }
  };

  const handleUpdateComment = (commentId: string) => {
    const updatedComments = comments.map((comment) =>
      comment.id === commentId
        ? {
            ...comment,
            text: editedText.trim(),
            updatedAt: new Date().toISOString(),
          }
        : comment
    );

    onUpdate(updatedComments);
    setEditingCommentId(null);
    setEditedText("");
    showSuccessToast("Comment updated successfully");
  };

  const handleDeleteComment = (commentId: string) => {
    const updatedComments = comments.filter(
      (comment) => comment.id !== commentId
    );
    onUpdate(updatedComments);
    showSuccessToast("Comment deleted successfully");
  };

  return (
    <div className="space-y-4">
      {comments.length > 0 && (
        <div className="space-y-2">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="group flex items-start justify-between gap-2 text-sm text-muted-foreground"
            >
              {editingCommentId === comment.id ? (
                <div className="flex-1 space-y-2">
                  <Textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    className="min-h-[60px] bg-background/60 backdrop-blur-sm"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleUpdateComment(comment.id)}
                      className="bg-black hover:bg-slate-950"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingCommentId(null)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="flex-1">{stringTrimToDots(comment.text, 25)}</p>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={() => handleEditComment(comment.id)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 hover:text-destructive"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {isEditing ? (
        <div className="space-y-2">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="min-h-[80px] bg-background/60 backdrop-blur-sm"
          />
          <div className="flex gap-2">
            <Button
              onClick={handleAddComment}
              className="flex-1 bg-black hover:bg-slate-950"
            >
              Add Comment
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setNewComment("");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(true)}
          className="w-full"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Add Comment
        </Button>
      )}
    </div>
  );
}
