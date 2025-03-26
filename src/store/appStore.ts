import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ImageProps, ColorPaletteProps, GroupProps, TagProps } from "../types";

interface AppState {
  images: ImageProps[];
  palettes: ColorPaletteProps[];
  groups: GroupProps[];
  tags: TagProps[];

  // Images actions
  addImage: (image: Omit<ImageProps, "id" | "createdAt">) => void;
  removeImage: (id: string) => void;
  updateImage: (id: string, data: Partial<ImageProps>) => void;

  // Palettes actions
  addPalette: (palette: Omit<ColorPaletteProps, "id" | "createdAt">) => void;
  removePalette: (id: string) => void;
  updatePalette: (id: string, data: Partial<ColorPaletteProps>) => void;

  // Groups actions
  addGroup: (name: string, parentId?: string) => void;
  removeGroup: (id: string) => void;
  updateGroup: (id: string, data: Partial<GroupProps>) => void;

  // Tags actions
  addTag: (name: string) => void;
  removeTag: (id: string) => void;
  updateTag: (id: string, name: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      images: [],
      palettes: [],
      groups: [],
      tags: [],

      addImage: (image) =>
        set((state) => ({
          images: [
            ...state.images,
            { ...image, id: crypto.randomUUID(), createdAt: new Date() },
          ],
        })),

      removeImage: (id) =>
        set((state) => ({
          images: state.images.filter((img) => img.id !== id),
        })),

      updateImage: (id, data) =>
        set((state) => ({
          images: state.images.map((img) =>
            img.id === id ? { ...img, ...data } : img
          ),
        })),

      addPalette: (palette) =>
        set((state) => ({
          palettes: [
            ...state.palettes,
            { ...palette, id: crypto.randomUUID(), createdAt: new Date() },
          ],
        })),

      removePalette: (id) =>
        set((state) => ({
          palettes: state.palettes.filter((palette) => palette.id !== id),
        })),

      updatePalette: (id, data) =>
        set((state) => ({
          palettes: state.palettes.map((palette) =>
            palette.id === id ? { ...palette, ...data } : palette
          ),
        })),

      addGroup: (name, parentId) =>
        set((state) => ({
          groups: [
            ...state.groups,
            { id: crypto.randomUUID(), name, parentId },
          ],
        })),

      removeGroup: (id) =>
        set((state) => ({
          groups: state.groups.filter((group) => group.id !== id),
        })),

      updateGroup: (id, data) =>
        set((state) => ({
          groups: state.groups.map((group) =>
            group.id === id ? { ...group, ...data } : group
          ),
        })),

      addTag: (name) =>
        set((state) => {
          const newTag = { id: crypto.randomUUID(), name };
          return {
            tags: [...state.tags, newTag],
          };
        }),

      removeTag: (id) =>
        set((state) => ({
          tags: state.tags.filter((tag) => tag.id !== id),
        })),

      updateTag: (id, name) =>
        set((state) => ({
          tags: state.tags.map((tag) =>
            tag.id === id ? { ...tag, name } : tag
          ),
        })),
    }),
    {
      name: "brand-zone-storage",
    }
  )
);
