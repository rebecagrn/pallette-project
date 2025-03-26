import { useState } from "react";
import { useStore } from "@/store/appStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface AddPaletteFormProps {
  onSuccess?: () => void;
}

export default function AddPaletteForm({ onSuccess }: AddPaletteFormProps) {
  const [name, setName] = useState("");
  const [colors, setColors] = useState<string[]>([]);
  const [newColor, setNewColor] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
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
      tagIds: selectedTagIds,
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
    setSelectedTagIds([]);
    setTagInput("");
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
    if (!tagInput.trim()) return;

    const newTagName = tagInput.trim();
    const existingTag = tags.find(
      (tag) => tag.name.toLowerCase() === newTagName.toLowerCase()
    );

    if (existingTag) {
      if (!selectedTagIds.includes(existingTag.id)) {
        setSelectedTagIds([...selectedTagIds, existingTag.id]);
        setTagInput("");
      } else {
        toast({
          title: "Duplicate Tag",
          description: "This tag is already added to the palette.",
          variant: "destructive",
        });
      }
    } else {
      const newTagId = crypto.randomUUID();
      addTag(newTagName);
      setSelectedTagIds([...selectedTagIds, newTagId]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagId: string) => {
    setSelectedTagIds(selectedTagIds.filter((id) => id !== tagId));
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
          <Button
            type="button"
            onClick={handleAddColor}
            className="bg-black hover:bg-slate-950"
          >
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
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTag(e)}
            placeholder="Add tags (press Enter)"
            className="flex-1"
          />
          <Button
            type="button"
            onClick={handleAddTag}
            className="bg-black hover:bg-slate-950"
          >
            Add
          </Button>
        </div>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className={`flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer transition-colors ${
                  selectedTagIds.includes(tag.id)
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary"
                }`}
                onClick={() => {
                  if (selectedTagIds.includes(tag.id)) {
                    handleRemoveTag(tag.id);
                  } else {
                    setSelectedTagIds([...selectedTagIds, tag.id]);
                  }
                }}
              >
                <span className="text-sm">{tag.name}</span>
                {selectedTagIds.includes(tag.id) && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveTag(tag.id);
                    }}
                    className="h-6 w-6 p-0"
                  >
                    ×
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full bg-black hover:bg-slate-950">
        Create Palette
      </Button>
    </form>
  );
}
