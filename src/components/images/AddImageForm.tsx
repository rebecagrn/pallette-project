import { useState } from "react";
import { useStore } from "@/store/appStore";

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
        <label
          htmlFor="url"
          className="block text-sm font-medium text-gray-700"
        >
          Image URL
        </label>
        <input
          type="url"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
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
        Add Image
      </button>
    </form>
  );
}
