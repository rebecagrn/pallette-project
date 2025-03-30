import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CommentSection from "../components/shared/CommentSection";
import { CommentProps } from "@/types";

// Mock the toast function
jest.mock("@/lib/toast", () => ({
  showSuccessToast: jest.fn(),
  showErrorToast: jest.fn(),
}));

describe("CommentSection", () => {
  const mockComments: CommentProps[] = [
    {
      id: "1",
      imageId: "test-image",
      text: "Test comment 1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      imageId: "test-image",
      text: "Test comment 2",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const mockOnUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders comments correctly", () => {
    render(
      <CommentSection
        itemId="test-image"
        comments={mockComments}
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText("Test comment 1")).toBeInTheDocument();
    expect(screen.getByText("Test comment 2")).toBeInTheDocument();
  });

  it("displays comment count", () => {
    render(
      <CommentSection
        itemId="test-image"
        comments={mockComments}
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText(/2 comments/)).toBeInTheDocument();
  });

  it("handles comment deletion", () => {
    render(
      <CommentSection
        itemId="test-image"
        comments={mockComments}
        onUpdate={mockOnUpdate}
      />
    );

    const deleteButtons = screen.getAllByLabelText("Delete comment");
    fireEvent.click(deleteButtons[0]);

    expect(mockOnUpdate).toHaveBeenCalledWith(
      mockComments.filter((comment) => comment.id !== "1")
    );
  });

  it("handles comment editing", () => {
    render(
      <CommentSection
        itemId="test-image"
        comments={mockComments}
        onUpdate={mockOnUpdate}
      />
    );

    // Start editing
    const editButtons = screen.getAllByLabelText("Edit comment");
    fireEvent.click(editButtons[0]);

    // Find textarea and update text
    const textarea = screen.getByDisplayValue("Test comment 1");
    fireEvent.change(textarea, { target: { value: "Updated comment" } });

    // Save changes
    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);

    expect(mockOnUpdate).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: "1",
          text: "Updated comment",
        }),
      ])
    );
  });

  it("shows empty state when no comments", () => {
    render(
      <CommentSection
        itemId="test-image"
        comments={[]}
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText("No comments yet")).toBeInTheDocument();
  });

  it("cancels comment editing", () => {
    render(
      <CommentSection
        itemId="test-image"
        comments={mockComments}
        onUpdate={mockOnUpdate}
      />
    );

    // Start editing
    const editButtons = screen.getAllByLabelText("Edit comment");
    fireEvent.click(editButtons[0]);

    // Find textarea and update text
    const textarea = screen.getByDisplayValue("Test comment 1");
    fireEvent.change(textarea, { target: { value: "Updated comment" } });

    // Cancel editing
    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    // Original text should still be present
    expect(screen.getByText("Test comment 1")).toBeInTheDocument();
    expect(mockOnUpdate).not.toHaveBeenCalled();
  });
});
