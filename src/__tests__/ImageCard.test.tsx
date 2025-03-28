import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ImageCard from "../components/images-module/ImageCard";
import { useStore } from "../store/appStore";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />;
  },
}));

describe("ImageCard", () => {
  const mockImage = {
    id: "1",
    url: "https://example.com/image.jpg",
    groupIds: [],
    tagIds: [],
    comments: [],
    createdAt: new Date().toISOString(),
  };

  const mockHandlers = {
    onDelete: jest.fn(),
    onEdit: jest.fn(),
  };

  beforeEach(() => {
    // Reset store before each test
    const store = useStore.getState();
    store.images = [mockImage];
    // Reset mock functions
    jest.clearAllMocks();
  });

  it("renders image with correct URL", () => {
    render(<ImageCard image={mockImage} {...mockHandlers} />);
    const imageElement = screen.getByRole("img");
    expect(imageElement).toHaveAttribute("src", mockImage.url);
  });

  it("displays creation date", () => {
    render(<ImageCard image={mockImage} {...mockHandlers} />);
    const date = new Date(mockImage.createdAt);
    const formattedDate = date.toLocaleDateString();
    expect(screen.getByText(formattedDate)).toBeInTheDocument();
  });

  it("handles favorite toggle", () => {
    render(<ImageCard image={mockImage} {...mockHandlers} />);

    // Find and click the favorite button
    const favoriteButton = screen.getByRole("button", { name: /favorite/i });
    fireEvent.click(favoriteButton);

    // Check if onEdit was called with correct parameters
    expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockImage.id, {
      isFavorite: true,
    });
  });

  it("shows comments count", () => {
    const imageWithComments = {
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

    render(<ImageCard image={imageWithComments} {...mockHandlers} />);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("handles delete action", () => {
    render(<ImageCard image={mockImage} {...mockHandlers} />);

    // Find and click the delete button
    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    // Check if onDelete was called with correct parameters
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockImage.id);
  });
});
