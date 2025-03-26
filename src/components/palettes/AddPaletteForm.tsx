import { useState } from "react";
import { useStore } from "@/store/appStore";

export default function AddPaletteForm() {
  const [name, setName] = useState("");
  const [colors, setColors] = useState<string[]>([]);
  const [newColor, setNewColor] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { addPalette, tags, addTag } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || colors.length === 0) return;

    addPalette({
      name,
      colors,
      tagIds: selectedTags,
      groupIds: [],
      comments: [],
    });

    setName("");
    setColors([]);
    setSelectedTags([]);
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
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Palette Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Colors
        </label>
        <div className="flex gap-2">
          <input
            type="color"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            className="h-10 w-20 rounded-md"
          />
          <button
            type="button"
            onClick={handleAddColor}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Color
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {colors.map((color, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-md"
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm">{color}</span>
              <button
                type="button"
                onClick={() => handleRemoveColor(index)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="tags"
          className="block text-sm font-medium text-gray-700"
        >
          Tags
        </label>
        <div className="mt-1 flex gap-2">
          <input
            type="text"
            id="tags"
            onKeyDown={(e) => e.key === "Enter" && handleAddTag(e)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Add a tag and press Enter"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add
          </button>
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
                <button
                  type="button"
                  onClick={() =>
                    setSelectedTags(selectedTags.filter((id) => id !== tag.id))
                  }
                  className="ml-1"
                >
                  ×
                </button>
              </span>
            ) : null;
          })}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
      >
        Create Palette
      </button>
    </form>
  );
}
