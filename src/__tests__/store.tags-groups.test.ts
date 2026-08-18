import { act } from "@testing-library/react";
import { useStore } from "../store/appStore";

describe("App Store - Tags and Groups", () => {
  beforeEach(() => {
    const store = useStore.getState();
    act(() => {
      store.tags = [];
      store.groups = [];
      store.images = [];
      store.palettes = [];
    });
  });

  describe("Tag Management", () => {
    it("should add a new tag", () => {
      const store = useStore.getState();
      const tagName = "Test Tag";

      act(() => {
        store.addTag(tagName);
      });

      const tags = useStore.getState().tags;
      expect(tags).toHaveLength(1);
      expect(tags[0]).toMatchObject({
        name: tagName,
        id: expect.any(String),
      });
    });

    it("should remove a tag", () => {
      const store = useStore.getState();
      act(() => {
        store.addTag("Test Tag");
      });

      const tagId = useStore.getState().tags[0].id;
      act(() => {
        store.removeTag(tagId);
      });

      expect(useStore.getState().tags).toHaveLength(0);
    });

    it("should strip removed tag ids from images and palettes", () => {
      const store = useStore.getState();
      let tagId = "";
      act(() => {
        tagId = store.addTag("Brand");
        store.addImage({
          url: "https://example.com/image.jpg",
          groupIds: [],
          tagIds: [tagId],
          comments: [],
        });
        store.addPalette({
          name: "Tagged",
          colors: ["#FF0000"],
          groupIds: [],
          tagIds: [tagId],
          comments: [],
        });
      });

      act(() => {
        useStore.getState().removeTag(tagId);
      });

      expect(useStore.getState().images[0].tagIds).toEqual([]);
      expect(useStore.getState().palettes[0].tagIds).toEqual([]);
    });

    it("should update a tag name", () => {
      const store = useStore.getState();
      act(() => {
        store.addTag("Test Tag");
      });

      const tagId = useStore.getState().tags[0].id;
      const newName = "Updated Tag";

      act(() => {
        store.updateTag(tagId, newName);
      });

      const updatedTag = useStore.getState().tags[0];
      expect(updatedTag.name).toBe(newName);
    });
  });

  describe("Group Management", () => {
    it("should add a new group", () => {
      const store = useStore.getState();
      const groupName = "Test Group";

      act(() => {
        store.addGroup(groupName);
      });

      const groups = useStore.getState().groups;
      expect(groups).toHaveLength(1);
      expect(groups[0]).toMatchObject({
        name: groupName,
        id: expect.any(String),
      });
    });

    it("should add a nested group", () => {
      const store = useStore.getState();

      act(() => {
        store.addGroup("Parent Group");
      });

      const parentId = useStore.getState().groups[0].id;

      act(() => {
        store.addGroup("Child Group", parentId);
      });

      const groups = useStore.getState().groups;
      expect(groups).toHaveLength(2);
      expect(groups[1].parentId).toBe(parentId);
    });

    it("should remove a group", () => {
      const store = useStore.getState();
      act(() => {
        store.addGroup("Test Group");
      });

      const groupId = useStore.getState().groups[0].id;
      act(() => {
        store.removeGroup(groupId);
      });

      expect(useStore.getState().groups).toHaveLength(0);
    });

    it("should strip removed group ids from images and palettes", () => {
      const store = useStore.getState();
      act(() => {
        store.addGroup("Campaign");
      });
      const groupId = useStore.getState().groups[0].id;
      act(() => {
        store.addImage({
          url: "https://example.com/image.jpg",
          groupIds: [groupId],
          tagIds: [],
          comments: [],
        });
        store.addPalette({
          name: "Grouped",
          colors: ["#00FF00"],
          groupIds: [groupId],
          tagIds: [],
          comments: [],
        });
      });

      act(() => {
        useStore.getState().removeGroup(groupId);
      });

      expect(useStore.getState().images[0].groupIds).toEqual([]);
      expect(useStore.getState().palettes[0].groupIds).toEqual([]);
    });

    it("should update a group", () => {
      const store = useStore.getState();
      act(() => {
        store.addGroup("Test Group");
      });

      const groupId = useStore.getState().groups[0].id;
      const newName = "Updated Group";

      act(() => {
        store.updateGroup(groupId, { name: newName });
      });

      const updatedGroup = useStore.getState().groups[0];
      expect(updatedGroup.name).toBe(newName);
    });
  });
});
