import { act } from "@testing-library/react";
import { useStore } from "../store/appStore";

describe("App Store", () => {
  beforeEach(() => {
    // Clear the store before each test
    const store = useStore.getState();
    act(() => {
      store.images = [];
      store.palettes = [];
      store.tags = [];
      store.groups = [];
      store.comments = [];
    });
  });

  describe("Image Management", () => {
    it("should add a new image", () => {
      const store = useStore.getState();
      const newImage = {
        url: "https://example.com/image.jpg",
        groupIds: [],
        tagIds: [],
        comments: [],
      };

      act(() => {
        store.addImage(newImage);
      });

      const images = useStore.getState().images;
      expect(images).toHaveLength(1);
      expect(images[0]).toMatchObject({
        ...newImage,
        id: expect.any(String),
        createdAt: expect.any(String),
      });
    });

    it("should remove an image", () => {
      const store = useStore.getState();
      act(() => {
        store.addImage({
          url: "https://example.com/image.jpg",
          groupIds: [],
          tagIds: [],
          comments: [],
        });
      });

      const imageId = useStore.getState().images[0].id;
      act(() => {
        store.removeImage(imageId);
      });

      expect(useStore.getState().images).toHaveLength(0);
    });

    it("should update an image", () => {
      const store = useStore.getState();
      act(() => {
        store.addImage({
          url: "https://example.com/image.jpg",
          groupIds: [],
          tagIds: [],
          comments: [],
        });
      });

      const imageId = useStore.getState().images[0].id;
      const newUrl = "https://example.com/updated.jpg";

      act(() => {
        store.updateImage(imageId, { url: newUrl });
      });

      const updatedImage = useStore.getState().images[0];
      expect(updatedImage.url).toBe(newUrl);
    });
  });

  describe("Palette Management", () => {
    it("should add a new palette", () => {
      const store = useStore.getState();
      const newPalette = {
        name: "Test Palette",
        colors: ["#FF0000", "#00FF00", "#0000FF"],
        groupIds: [],
        tagIds: [],
        comments: [],
      };

      act(() => {
        store.addPalette(newPalette);
      });

      const palettes = useStore.getState().palettes;
      expect(palettes).toHaveLength(1);
      expect(palettes[0]).toMatchObject({
        ...newPalette,
        id: expect.any(String),
        createdAt: expect.any(String),
      });
    });

    it("should remove a palette", () => {
      const store = useStore.getState();
      act(() => {
        store.addPalette({
          name: "Test Palette",
          colors: ["#FF0000"],
          groupIds: [],
          tagIds: [],
          comments: [],
        });
      });

      const paletteId = useStore.getState().palettes[0].id;
      act(() => {
        store.removePalette(paletteId);
      });

      expect(useStore.getState().palettes).toHaveLength(0);
    });

    it("should update a palette", () => {
      const store = useStore.getState();
      act(() => {
        store.addPalette({
          name: "Test Palette",
          colors: ["#FF0000"],
          groupIds: [],
          tagIds: [],
          comments: [],
        });
      });

      const paletteId = useStore.getState().palettes[0].id;
      const newName = "Updated Palette";

      act(() => {
        store.updatePalette(paletteId, { name: newName });
      });

      const updatedPalette = useStore.getState().palettes[0];
      expect(updatedPalette.name).toBe(newName);
    });
  });

  describe("View Mode and Sort", () => {
    it("should update view mode", () => {
      const store = useStore.getState();
      act(() => {
        store.setViewMode("list");
      });

      expect(useStore.getState().viewMode).toBe("list");
    });

    it("should update sort by", () => {
      const store = useStore.getState();
      act(() => {
        store.setSortBy("oldest");
      });

      expect(useStore.getState().sortBy).toBe("oldest");
    });
  });
});
