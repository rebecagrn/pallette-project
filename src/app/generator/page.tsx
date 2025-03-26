"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/hooks/use-toast";

export default function ColorPaletteGenerator() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [extractedColors, setExtractedColors] = useState<string[]>([]);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        // Here you would typically call your color extraction API
        // For now, we'll use placeholder colors
        setExtractedColors(["#FFAEBC", "#A0E7E5", "#B4F8C8", "#FBE7C6"]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDemoImage = () => {
    setSelectedImage("/demo-palette.jpg");
    setExtractedColors(["#FFAEBC", "#A0E7E5", "#B4F8C8", "#FBE7C6"]);
  };

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    toast({
      title: "Color copied!",
      description: `${color} has been copied to your clipboard.`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Color Palette Generator</h1>

        <Card className="p-6 mb-8">
          <div className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="image">Upload Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
            <div className="- or -divider text-center relative my-8">
              <span className="bg-white px-4 text-gray-500">or</span>
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
            </div>
            <Button
              onClick={handleDemoImage}
              variant="outline"
              className="w-full"
            >
              Try with demo image
            </Button>
          </div>
        </Card>

        {selectedImage && (
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-4">
              <div className="aspect-square rounded-lg overflow-hidden">
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Extracted Colors</h2>
              <div className="grid gap-4">
                {extractedColors.map((color, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 rounded-lg border cursor-pointer hover:bg-gray-50"
                    onClick={() => copyColor(color)}
                  >
                    <div
                      className="w-16 h-16 rounded"
                      style={{ backgroundColor: color }}
                    />
                    <div>
                      <p className="font-medium">{color}</p>
                      <p className="text-sm text-gray-500">Click to copy</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
