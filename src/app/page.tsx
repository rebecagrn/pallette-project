import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
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
                <div className="h-24 bg-[#FFAEBC]"></div>
                <div className="h-24 bg-[#A0E7E5]"></div>
                <div className="h-24 bg-[#B4F8C8]"></div>
                <div className="h-24 bg-[#FBE7C6]"></div>
              </div>
              <div className="grid grid-cols-4 gap-1 mt-1">
                <div className="text-center text-sm text-gray-600">
                  Hot Pink
                </div>
                <div className="text-center text-sm text-gray-600">
                  Tiffany Blue
                </div>
                <div className="text-center text-sm text-gray-600">Mint</div>
                <div className="text-center text-sm text-gray-600">Yellow</div>
              </div>
              <div className="grid grid-cols-4 gap-1">
                <div className="text-center text-xs text-gray-500">#FFAEBC</div>
                <div className="text-center text-xs text-gray-500">#A0E7E5</div>
                <div className="text-center text-xs text-gray-500">#B4F8C8</div>
                <div className="text-center text-xs text-gray-500">#FBE7C6</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Color Combinations Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            For endless color palette ideas, visit our color combinations
            resource
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {colorPalettes.map((palette, index) => (
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

const colorPalettes = [
  ["#FFE4E1", "#FFC0CB", "#FFB6C1", "#FF69B4"],
  ["#FF69B4", "#FFF0F5", "#98FB98", "#DDA0DD"],
  ["#FFC0CB", "#FFE4E1", "#808080", "#696969"],
  ["#003366", "#0099CC", "#00CCFF", "#99FFFF"],
  ["#FFE4B5", "#98FB98", "#87CEEB", "#FFC0CB"],
  ["#000033", "#000066", "#0000FF", "#87CEEB"],
  ["#DCDCDC", "#C0C0C0", "#808080", "#FFFFFF"],
  ["#CD853F", "#FFF8DC", "#006400", "#DEB887"],
  ["#4682B4", "#000080", "#4169E1", "#B0E0E6"],
  ["#40E0D0", "#FFFF00", "#FF1493", "#FF0000"],
  ["#006400", "#228B22", "#90EE90", "#006400"],
  ["#FFF0F5", "#FFE4E1", "#CD853F", "#DEB887"],
];
