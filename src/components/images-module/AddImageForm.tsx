import { useState } from "react";
import { useStore } from "@/store/appStore";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AddImageForm() {
  const [url, setUrl] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { addImage, tags, addTag } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    addImage({
      url,
      tagIds: selectedTags,
      groupIds: [],
      comments: [],
    });

    setUrl("");
    setSelectedTags([]);
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
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <div>
        <Label
          htmlFor="url"
          className="block text-sm font-medium text-gray-700"
        >
          Image URL
        </Label>
        <Input
          type="url"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <Label
          htmlFor="tags"
          className="block text-sm font-medium text-gray-700"
        >
          Tags
        </Label>
        <div className="mt-1 flex gap-2">
          <Input
            type="text"
            id="tags"
            onKeyDown={(e) => e.key === "Enter" && handleAddTag(e)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Add a tag and press Enter"
          />
          <Button
            type="button"
            onClick={handleAddTag}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add
          </Button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedTags.map((tagId) => {
            const tag = tags.find((t) => t.id === tagId);
            return tag ? (
              <span
                key={tag.id}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {tag.name}
                <Button
                  type="button"
                  onClick={() =>
                    setSelectedTags(selectedTags.filter((id) => id !== tag.id))
                  }
                  className="ml-1"
                >
                  ×
                </Button>
              </span>
            ) : null;
          })}
        </div>
      </div>

      <Button type="submit" className="w-full">
        Add Image
      </Button>
    </form>
  );
}
