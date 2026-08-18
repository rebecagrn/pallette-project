import ColorThief from "colorthief";

export async function extractColors(
  imageUrl: string,
  colorCount: number = 6
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";

    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const palette = colorThief.getPalette(img, colorCount);
        const hexColors = palette.map(([r, g, b]: [number, number, number]) =>
          rgbToHex(r, g, b)
        );
        resolve(hexColors);
      } catch {
        reject(new Error(getExtractionErrorMessage(imageUrl)));
      }
    };

    img.onerror = () => {
      reject(new Error(getLoadErrorMessage(imageUrl)));
    };

    img.src = imageUrl;
  });
}

function isRemoteImageUrl(imageUrl: string): boolean {
  return imageUrl.startsWith("http://") || imageUrl.startsWith("https://");
}

function getLoadErrorMessage(imageUrl: string): string {
  if (isRemoteImageUrl(imageUrl))
    return "This image host blocks color extraction. Try uploading the file instead.";
  return "Failed to load image";
}

function getExtractionErrorMessage(imageUrl: string): string {
  if (isRemoteImageUrl(imageUrl))
    return "This image host blocks color extraction. Try uploading the file instead.";
  return "Failed to extract colors from image";
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}
