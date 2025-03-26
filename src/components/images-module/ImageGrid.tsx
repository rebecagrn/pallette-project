import { ImageProps } from "@/types";
import ImageCard from "./ImageCard";

interface ImageGridProps {
  images: ImageProps[];
  onDelete: (id: string) => void;
  onEdit: (id: string, data: Partial<ImageProps>) => void;
}

export default function ImageGrid({
  images,
  onDelete,
  onEdit,
}: ImageGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {images.map((image) => (
        <ImageCard
          key={image.id}
          image={image}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
