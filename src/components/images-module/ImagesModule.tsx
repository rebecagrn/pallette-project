import { useStore } from "@/store/appStore";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ImageProps } from "@/types";
import AddImageForm from "./AddImageForm";
import ImageGrid from "./ImageGrid";
import ImagesHeader from "./ImagesHeader";
import GroupManager from "./GroupManager";

export default function ImagesModule() {
  const {
    images,
    viewMode,
    sortBy,
    showAddImageDialog,
    removeImage,
    updateImage,
    setViewMode,
    setSortBy,
    setShowAddImageDialog,
  } = useStore();

  const sortedImages = [...images].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "name":
        return a.url.localeCompare(b.url);
      default:
        return 0;
    }
  });

  const handleDelete = (id: string) => {
    removeImage(id);
  };

  const handleEdit = (id: string, data: Partial<ImageProps>) => {
    updateImage(id, data);
  };

  return (
    <div className="mx-auto py-8 space-y-8">
      <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <ImagesHeader
            totalImages={images.length}
            onAddClick={() => setShowAddImageDialog(true)}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          <ImageGrid
            images={sortedImages}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </div>

        <div className="space-y-6">
          <GroupManager />
        </div>
      </div>

      <Dialog open={showAddImageDialog} onOpenChange={setShowAddImageDialog}>
        <DialogContent className="max-w-3xl">
          <AddImageForm onSuccess={() => setShowAddImageDialog(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
