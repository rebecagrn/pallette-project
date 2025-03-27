"use client";

import ImagesModule from "@/components/images-module/ImagesModule";

export default function GeneratorPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Generator</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Generate color palettes from images and manage your visual
          inspiration.
        </p>
      </div>
      <ImagesModule />
    </div>
  );
}
