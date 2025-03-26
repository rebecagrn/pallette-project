import { useState } from "react";
import { useStore } from "@/store/appStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface AddPaletteFormProps {
  onSuccess?: () => void;
}

export default function AddPaletteForm({ onSuccess }: AddPaletteFormProps) {
  const [name, setName] = useState("");
  const [colors, setColors] = useState<string[]>([]);
  const [newColor, setNewColor] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { addPalette, tags, addTag } = useStore();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || colors.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please provide a name and at least one color.",
        variant: "destructive",
      });
      return;
    }

    addPalette({
      name,
      colors,
      tagIds: selectedTags,
      groupIds: [],
      comments: [],
      isFavorite: false,
    });

    toast({
      title: "Success",
      description: "Palette created successfully!",
    });

    setName("");
    setColors([]);
    setSelectedTags([]);
    onSuccess?.();
  };

  const handleAddColor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColor.trim()) return;

    setColors([...colors, newColor]);
    setNewColor("");
  };

  const handleRemoveColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    const input = e.target as HTMLInputElement;
    if (!input.value.trim()) return;

    const newTagId = crypto.randomUUID();
    addTag(input.value);
    setSelectedTags([...selectedTags, newTagId]);
    input.value = "";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Palette Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter palette name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Colors</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            className="w-20 h-10 p-1"
          />
          <Button type="button" onClick={handleAddColor}>
            Add Color
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {colors.map((color, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-secondary px-2 py-1 rounded-md"
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm">{color}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveColor(index)}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <div className="flex gap-2">
          <Input
            id="tags"
            onKeyDown={(e) => e.key === "Enter" && handleAddTag(e)}
            placeholder="Add a tag and press Enter"
          />
          <Button type="button" onClick={handleAddTag}>
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tagId) => {
            const tag = tags.find((t) => t.id === tagId);
            return tag ? (
              <div
                key={tag.id}
                className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md"
              >
                <span className="text-sm">{tag.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setSelectedTags(selectedTags.filter((id) => id !== tag.id))
                  }
                  className="h-6 w-6 p-0"
                >
                  ×
                </Button>
              </div>
            ) : null;
          })}
        </div>
      </div>

      <Button type="submit" className="w-full">
        Create Palette
      </Button>
    </form>
  );
}
