import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DEMO_COLOR_PALETTES, DEMO_PALETTE_COLORS } from "@/types/constants";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-6">
                Get colors from your photos
              </h1>
              <p className="text-base text-gray-500 mb-8">
                Looking for a color scheme that perfectly matches your favorite
                images? Our color palette generator makes it effortless! Simply
                upload a photo, and we'll extract the perfect color combinations
                in seconds. Try it now and bring your images to life with the
                perfect palette!
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                  Upload an image
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-lg overflow-hidden">
                <img
                  src="/demo-palette.jpg"
                  alt="Color Palette Demo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-1 mt-2">
                {DEMO_PALETTE_COLORS.map((color) => (
                  <div
                    key={color.hex}
                    className="h-24"
                    style={{ backgroundColor: color.color }}
                  />
                ))}
              </div>
              <div className="grid grid-cols-4 gap-1 mt-1">
                {DEMO_PALETTE_COLORS.map((color) => (
                  <div
                    key={color.hex}
                    className="text-center text-sm text-gray-600"
                  >
                    {color.name}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-1">
                {DEMO_PALETTE_COLORS.map((color) => (
                  <div
                    key={color.hex}
                    className="text-center text-xs text-gray-500"
                  >
                    {color.hex}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Explore, create, and find the perfect color palette ideas for you!
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {DEMO_COLOR_PALETTES.map((palette, index) => (
              <Card key={index} className="p-2">
                <div className="flex h-20">
                  {palette.map((color, colorIndex) => (
                    <div
                      key={colorIndex}
                      className="flex-1"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </Card>
            ))}
          </div>
          <div className="flex justify-center gap-4">
            <Link href="/generator">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                Explore color palettes
              </Button>
            </Link>
            <Link href="/palettes">
              <Button size="lg" variant="outline">
                Create a custom color palette
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
