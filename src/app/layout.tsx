import { Inter, Leckerli_One } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/ui/navigation";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });
const leckerliOne = Leckerli_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-leckerli",
});

export const metadata: Metadata = {
  title: {
    default: "Palette Project - Color Palette Generator",
    template: "%s | Palette Project",
  },
  description:
    "Generate beautiful color palettes from your images. Upload photos and extract perfect color combinations for your design projects.",
  keywords: [
    "color palette",
    "color generator",
    "design tools",
    "color extraction",
    "image colors",
  ],
  authors: [{ name: "Palette Project" }],
  creator: "Palette Project",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://palette-project.vercel.app",
    title: "Palette Project - Color Palette Generator",
    description:
      "Generate beautiful color palettes from your images. Upload photos and extract perfect color combinations for your design projects.",
    siteName: "Palette Project",
  },
  twitter: {
    card: "summary_large_image",
    title: "Palette Project - Color Palette Generator",
    description:
      "Generate beautiful color palettes from your images. Upload photos and extract perfect color combinations for your design projects.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.className,
          leckerliOne.variable
        )}
      >
        <div className="relative flex min-h-screen flex-col">
          <Navigation />
          <main className="flex-1">{children}</main>
        </div>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
