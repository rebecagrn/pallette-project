"use client";

import { useStore } from "@/store/appStore";
import PaletteGrid from "@/components/palettes-module/PaletteGrid";
import AddPaletteForm from "@/components/palettes-module/AddPaletteForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function PalettesPage() {
  const { palettes, removePalette, updatePalette } = useStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Color Palettes</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="mr-2 h-4 w-4" />
              New Palette
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Palette</DialogTitle>
            </DialogHeader>
            <AddPaletteForm onSuccess={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Palettes</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Palettes</CardTitle>
            </CardHeader>
            <CardContent>
              {palettes.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500">No palettes found</p>
                </div>
              ) : (
                <PaletteGrid
                  palettes={palettes}
                  onDelete={removePalette}
                  onEdit={updatePalette}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="favorites">
          <Card>
            <CardHeader>
              <CardTitle>Favorite Palettes</CardTitle>
            </CardHeader>
            <CardContent>
              <PaletteGrid
                palettes={palettes.filter((p) => p.isFavorite)}
                onDelete={removePalette}
                onEdit={updatePalette}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recently Created</CardTitle>
            </CardHeader>
            <CardContent>
              <PaletteGrid
                palettes={[...palettes]
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )
                  .slice(0, 10)}
                onDelete={removePalette}
                onEdit={updatePalette}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
