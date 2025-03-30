import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Color Generator",
  description:
    "Upload images and generate beautiful color palettes. Extract colors from your favorite photos and create stunning color combinations.",
};

export default function GeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
