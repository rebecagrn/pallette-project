"use client";

import { useStore } from "@/store/appStore";
import ImageGrid from "@/components/images-module/ImageGrid";
import AddImageForm from "@/components/images-module/AddImageForm";

export default function ImagesPage() {
  const { images, removeImage, updateImage } = useStore();

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-8">Image References</h1>
      <AddImageForm />
      <ImageGrid images={images} onDelete={removeImage} onEdit={updateImage} />
    </div>
  );
}
