import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ImageCard from "../components/images-module/ImageCard";
import { ImageProps } from "@/types";

// Mock the toast function
jest.mock("@/lib/toast", () => ({
  showSuccessToast: jest.fn(),
  showErrorToast: jest.fn(),
}));

describe("ImageCard", () => {
  const mockImage: ImageProps = {
    id: "1",
    url: "https://example.com/image.jpg",
    isFavorite: false,
    comments: [],
    groupIds: [],
    tagIds: [],
    createdAt: new Date().toISOString(),
  };

  const imageWithComments: ImageProps = {
    ...mockImage,
    comments: [
      {
        id: "1",
        imageId: "1",
        text: "Test comment",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  };

  const mockHandlers = {
    onEdit: jest.fn(),
    onDelete: jest.fn(),
  };

  it("renders image correctly", () => {
    render(<ImageCard image={mockImage} {...mockHandlers} />);
    expect(screen.getByAltText("Uploaded image")).toBeInTheDocument();
  });

  it("handles favorite toggle", () => {
    render(<ImageCard image={mockImage} {...mockHandlers} />);

    const favoriteButton = screen.getByLabelText("Toggle favorite");
    fireEvent.click(favoriteButton);

    expect(mockHandlers.onEdit).toHaveBeenCalledWith({
      ...mockImage,
      isFavorite: true,
    });
  });

  it("shows comments count", () => {
    render(<ImageCard image={imageWithComments} {...mockHandlers} />);
    expect(screen.getByText("1 comment")).toBeInTheDocument();
  });

  it("handles delete action", () => {
    render(<ImageCard image={mockImage} {...mockHandlers} />);

    const deleteButton = screen.getByLabelText("Delete image");
    fireEvent.click(deleteButton);

    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockImage.id);
  });
});
