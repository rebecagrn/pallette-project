import { useState, useRef } from "react";
import { useStore } from "@/store/appStore";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload } from "lucide-react";
import Image from "next/image";
import { showSuccessToast, showErrorToast } from "@/lib/toast";

interface AddImageFormProps {
  onSuccess?: () => void;
}

export default function AddImageForm({ onSuccess }: AddImageFormProps) {
  const [url, setUrl] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addImage, tags, groups, addTag } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      showErrorToast("Please enter an image URL");
      return;
    }

    addImage({
      url,
      tagIds: selectedTags,
      groupIds: selectedGroups,
      comments: [],
      isFavorite: false,
    });

    setUrl("");
    setSelectedTags([]);
    setSelectedGroups([]);
    setTagInput("");
    onSuccess?.();

    showSuccessToast("Image added successfully");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showErrorToast("Please upload an image file");
      return;
    }

    setIsUploading(true);
    try {
      // Here you would typically upload to your storage service
      // For now, we'll create a local URL
      const imageUrl = URL.createObjectURL(file);
      setUrl(imageUrl);
      showSuccessToast("Image uploaded successfully");
    } catch (error) {
      showErrorToast("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagInput.trim()) return;

    const newTagName = tagInput.trim();
    const existingTag = tags.find(
      (tag) => tag.name.toLowerCase() === newTagName.toLowerCase()
    );

    if (existingTag) {
      if (!selectedTags.includes(existingTag.id)) {
        setSelectedTags([...selectedTags, existingTag.id]);
      }
    } else {
      const newTagId = crypto.randomUUID();
      addTag(newTagName);
      setSelectedTags([...selectedTags, newTagId]);
    }
    setTagInput("");
  };

  const handleToggleGroup = (groupId: string) => {
    setSelectedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-bl from-purple-500/20 to-transparent rounded-full transform translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-tr from-blue-500/20 to-transparent rounded-full transform -translate-x-1/2 translate-y-1/2" />

      <CardHeader>
        <CardTitle className="text-xl font-bold">Add new image</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6 relative">
          <div className="grid gap-6 md:grid-cols-1">
            <div className="space-y-2">
              <Label htmlFor="url">Image URL</Label>
              <div className="flex gap-2">
                <Input
                  type="url"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter image URL or upload"
                  className="bg-background/60 backdrop-blur-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  className="shrink-0"
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              <Input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            {url && (
              <div className="relative w-full max-w-[200px] aspect-square rounded-lg overflow-hidden bg-background/60 backdrop-blur-sm">
                <Image src={url} alt="Preview" className="object-cover" fill />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Groups</Label>
            <div className="flex flex-wrap gap-2">
              {groups.map((group) => (
                <Badge
                  key={group.id}
                  variant={
                    selectedGroups.includes(group.id) ? "default" : "outline"
                  }
                  className="cursor-pointer hover:bg-primary/90"
                  onClick={() => handleToggleGroup(group.id)}
                >
                  {group.name}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddTag(e))
                }
                placeholder="Add tags"
                className="bg-background/60 backdrop-blur-sm"
              />
              <Button type="button" onClick={handleAddTag} variant="secondary">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={
                    selectedTags.includes(tag.id) ? "default" : "outline"
                  }
                  className="cursor-pointer hover:bg-primary/90"
                  onClick={() => {
                    setSelectedTags((prev) =>
                      prev.includes(tag.id)
                        ? prev.filter((id) => id !== tag.id)
                        : [...prev, tag.id]
                    );
                  }}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-black hover:bg-slate-950 text-white"
            disabled={isUploading || !url.trim()}
          >
            {isUploading ? "Uploading..." : "Add Image"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
