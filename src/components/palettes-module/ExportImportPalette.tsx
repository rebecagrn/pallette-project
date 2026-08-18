import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { ColorPaletteProps } from "@/types";
import { showSuccessToast, showErrorToast } from "@/lib/toast";

interface ExportImportPaletteProps {
  palette: ColorPaletteProps
  onImport: (palette: Partial<ColorPaletteProps>) => void
  compact?: boolean
}

export default function ExportImportPalette({
  palette,
  onImport,
  compact = false,
}: ExportImportPaletteProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      const exportData = {
        name: palette.name,
        colors: palette.colors,
        tagIds: palette.tagIds,
        groupIds: palette.groupIds,
        comments: palette.comments,
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${palette.name
        .toLowerCase()
        .replace(/\s+/g, "-")}-palette.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showSuccessToast("Palette exported successfully");
    } catch (error) {
      showErrorToast("Failed to export palette");
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);

        // Validate imported data
        if (!importedData.colors || !Array.isArray(importedData.colors)) {
          throw new Error("Invalid palette format");
        }

        onImport({
          name: importedData.name || "Imported Palette",
          colors: importedData.colors,
          tagIds: importedData.tagIds || [],
          groupIds: importedData.groupIds || [],
          comments: importedData.comments || [],
        });

        showSuccessToast("Palette imported successfully");
      } catch (error) {
        showErrorToast(
          "Failed to import palette. Please check the file format."
        );
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="flex gap-0.5">
      <Button
        variant={compact ? "ghost" : "outline"}
        size={compact ? "icon" : "sm"}
        onClick={handleExport}
        className={compact ? "h-8 w-8" : "flex items-center gap-2"}
        aria-label="Export palette"
      >
        <Download className="h-4 w-4" />
        {!compact && "Export"}
      </Button>
      <Button
        variant={compact ? "ghost" : "outline"}
        size={compact ? "icon" : "sm"}
        onClick={() => fileInputRef.current?.click()}
        className={compact ? "h-8 w-8" : "flex items-center gap-2"}
        aria-label="Import palette"
      >
        <Upload className="h-4 w-4" />
        {!compact && "Import"}
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImport}
        accept=".json"
        className="hidden"
      />
    </div>
  )
}
