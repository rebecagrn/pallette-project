import { ColorPaletteProps } from "@/types";
import PaletteCard from "@/components/palettes-module/PaletteCard";

interface PaletteGridProps {
  palettes: ColorPaletteProps[];
  onDelete: (id: string) => void;
  onEdit: (id: string, data: Partial<ColorPaletteProps>) => void;
}

export default function PaletteGrid({
  palettes,
  onDelete,
  onEdit,
}: PaletteGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {palettes.map((palette) => (
        <PaletteCard
          key={palette.id}
          palette={palette}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
