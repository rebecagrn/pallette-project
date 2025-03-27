import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  ImageProps,
  ColorPaletteProps,
  GroupProps,
  TagProps,
  CommentProps,
} from "../types";
import { nanoid } from "nanoid";

interface AppState {
  images: ImageProps[];
  viewMode: "grid" | "list";
  sortBy: "newest" | "oldest" | "name";
  showAddImageDialog: boolean;
  palettes: ColorPaletteProps[];
  groups: GroupProps[];
  tags: TagProps[];
  comments: CommentProps[];

  // Images actions
  addImage: (image: Omit<ImageProps, "id" | "createdAt">) => void;
  removeImage: (id: string) => void;
  updateImage: (id: string, data: Partial<ImageProps>) => void;
  setViewMode: (mode: "grid" | "list") => void;
  setSortBy: (sort: "newest" | "oldest" | "name") => void;
  setShowAddImageDialog: (show: boolean) => void;

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

  // Comments actions
  addComment: (imageId: string, text: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      images: [],
      viewMode: "grid",
      sortBy: "newest",
      showAddImageDialog: false,
      palettes: [],
      groups: [],
      tags: [],
      comments: [],

      setViewMode: (mode) => set({ viewMode: mode }),
      setSortBy: (sort) => set({ sortBy: sort }),
      setShowAddImageDialog: (show) => set({ showAddImageDialog: show }),

      addImage: (image: Omit<ImageProps, "id" | "createdAt">) => {
        const newImage: ImageProps = {
          ...image,
          id: nanoid(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          images: [...state.images, newImage],
        }));
      },

      removeImage: (id: string) =>
        set((state) => ({
          images: state.images.filter((img) => img.id !== id),
        })),

      updateImage: (id, data) =>
        set((state) => ({
          images: state.images.map((img) =>
            img.id === id ? { ...img, ...data } : img
          ),
        })),

      addPalette: (palette: Omit<ColorPaletteProps, "id" | "createdAt">) => {
        const newPalette: ColorPaletteProps = {
          ...palette,
          id: nanoid(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          palettes: [...state.palettes, newPalette],
        }));
      },

      removePalette: (id: string) =>
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
          groups: [...state.groups, { id: nanoid(), name, parentId }],
        })),

      removeGroup: (id: string) =>
        set((state) => ({
          groups: state.groups.filter((group) => group.id !== id),
        })),

      updateGroup: (id, data) =>
        set((state) => ({
          groups: state.groups.map((group) =>
            group.id === id ? { ...group, ...data } : group
          ),
        })),

      addTag: (name: string) =>
        set((state) => {
          const newTag = { id: nanoid(), name };
          return {
            tags: [...state.tags, newTag],
          };
        }),

      removeTag: (id: string) =>
        set((state) => ({
          tags: state.tags.filter((tag) => tag.id !== id),
        })),

      updateTag: (id, name: string) =>
        set((state) => ({
          tags: state.tags.map((tag) =>
            tag.id === id ? { ...tag, name } : tag
          ),
        })),

      addComment: (imageId: string, text: string) => {
        const newComment = {
          id: nanoid(),
          imageId,
          text,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          comments: [...state.comments, newComment],
        }));
      },
    }),
    {
      name: "brand-zone-storage",
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const data = JSON.parse(str);
          if (data.state) {
            data.state.images = data.state.images.map((img: any) => ({
              ...img,
              createdAt: img.createdAt,
            }));
            data.state.palettes = data.state.palettes.map((palette: any) => ({
              ...palette,
              createdAt: palette.createdAt,
            }));
          }
          return data;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
