"use client";

import { useStore } from "@/store/appStore";
import PaletteGrid from "@/components/palettes/PaletteGrid";
import AddPaletteForm from "@/components/palettes/AddPaletteForm";

export default function PalettesPage() {
  const { palettes, removePalette, updatePalette } = useStore();

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-8">Color Palettes</h1>
      <AddPaletteForm />
      <PaletteGrid
        palettes={palettes}
        onDelete={removePalette}
        onEdit={updatePalette}
      />
    </div>
  );
}
