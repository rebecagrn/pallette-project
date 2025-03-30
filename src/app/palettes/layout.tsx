import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Color Palettes",
  description:
    "Browse, create, and manage your color palettes. Find inspiration and organize your favorite color combinations.",
};

export default function PalettesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
