import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import AddImageForm from "../components/images-module/AddImageForm";
import { useStore } from "../store/appStore";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />;
  },
}));

describe("AddImageForm", () => {
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    // Reset store before each test
    const store = useStore.getState();
    store.tags = [];
    store.groups = [];
    // Reset mock functions
    jest.clearAllMocks();
  });

  it("renders form elements", () => {
    render(<AddImageForm onSuccess={mockOnSuccess} />);

    expect(screen.getByLabelText(/image url/i)).toBeInTheDocument();
    expect(screen.getByText(/add image/i)).toBeInTheDocument();
    expect(screen.getByText(/groups/i)).toBeInTheDocument();
    expect(screen.getByText(/tags/i)).toBeInTheDocument();
  });

  it("handles URL input", () => {
    render(<AddImageForm onSuccess={mockOnSuccess} />);

    const urlInput = screen.getByLabelText(/image url/i);
    fireEvent.change(urlInput, {
      target: { value: "https://example.com/image.jpg" },
    });

    expect(urlInput).toHaveValue("https://example.com/image.jpg");
  });

  it("handles form submission", () => {
    const store = useStore.getState();
    const addImageSpy = jest.spyOn(store, "addImage");

    render(<AddImageForm onSuccess={mockOnSuccess} />);

    const urlInput = screen.getByLabelText(/image url/i);
    fireEvent.change(urlInput, {
      target: { value: "https://example.com/image.jpg" },
    });

    const submitButton = screen.getByRole("button", { name: /add image/i });
    fireEvent.click(submitButton);

    expect(addImageSpy).toHaveBeenCalledWith({
      url: "https://example.com/image.jpg",
      tagIds: [],
      groupIds: [],
      comments: [],
      isFavorite: false,
    });
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it("handles tag addition", () => {
    const store = useStore.getState();
    const addTagSpy = jest.spyOn(store, "addTag");

    render(<AddImageForm onSuccess={mockOnSuccess} />);

    const tagInput = screen.getByLabelText(/tags/i);
    fireEvent.change(tagInput, { target: { value: "new-tag" } });

    const addTagButton = screen.getByRole("button", { name: "Add" });
    fireEvent.click(addTagButton);

    expect(addTagSpy).toHaveBeenCalledWith("new-tag");
  });

  it("prevents submission without URL", () => {
    const store = useStore.getState();
    const addImageSpy = jest.spyOn(store, "addImage");

    render(<AddImageForm onSuccess={mockOnSuccess} />);

    const submitButton = screen.getByRole("button", { name: /add image/i });
    fireEvent.click(submitButton);

    expect(addImageSpy).not.toHaveBeenCalled();
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it("handles group selection", () => {
    const store = useStore.getState();
    store.groups = [{ id: "1", name: "Test Group" }];

    render(<AddImageForm onSuccess={mockOnSuccess} />);

    const groupBadge = screen.getByText("Test Group");
    fireEvent.click(groupBadge);

    const urlInput = screen.getByLabelText(/image url/i);
    fireEvent.change(urlInput, {
      target: { value: "https://example.com/image.jpg" },
    });

    const submitButton = screen.getByRole("button", { name: /add image/i });
    fireEvent.click(submitButton);

    expect(store.addImage).toHaveBeenCalledWith(
      expect.objectContaining({
        groupIds: ["1"],
      })
    );
  });
});
