"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BarChart, ImageIcon, Palette } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold">
              Pallette
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/generator"
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                  pathname === "/generator"
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                <ImageIcon className="h-4 w-4" />
                Generator
              </Link>
              <Link
                href="/palettes"
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                  pathname === "/palettes"
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                <Palette className="h-4 w-4" />
                Palettes
              </Link>
              <Link
                href="/dashboard"
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                  pathname === "/dashboard"
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                <BarChart className="h-4 w-4" />
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
