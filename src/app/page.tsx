import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DEMO_COLOR_PALETTES, DEMO_PALETTE_COLORS } from "@/types/constants";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1">
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-6">
                  Get colors from your photos
                </h1>
                <p className="text-base text-gray-500 mb-8">
                  Looking for a color scheme that perfectly matches your
                  favorite images? Our color palette generator makes it
                  effortless! Simply upload a photo, and we'll extract the
                  perfect color combinations in seconds. Try it now and bring
                  your images to life with the perfect palette!
                </p>
                <div className="flex gap-4">
                  <Link href="/generator">
                    <Button size="lg" className="bg-black hover:bg-slate-950">
                      Upload an image
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative rounded-xl p-4">
                <div className="aspect-square rounded-lg overflow-hidden items-center flex justify-center">
                  <Image
                    src="/assets/images/demo-palette.jpg"
                    alt="Color Palette Demo"
                    className="object-cover"
                    width={700}
                    height={700}
                    priority
                  />
                </div>
                <div className="space-y-1">
                  <div className="grid grid-cols-4 gap-1.5">
                    {DEMO_PALETTE_COLORS.map((color) => (
                      <div
                        key={color.hex}
                        className="h-14 rounded-md"
                        style={{ backgroundColor: color.color }}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {DEMO_PALETTE_COLORS.map((color) => (
                      <div
                        key={color.hex}
                        className="text-center text-sm font-medium text-gray-700"
                      >
                        {color.name}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {DEMO_PALETTE_COLORS.map((color) => (
                      <div
                        key={color.hex}
                        className="text-center text-xs font-mono text-gray-500"
                      >
                        {color.hex}
                      </div>
                    ))}
                  </div>
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
                <Button size="lg" className="bg-black hover:bg-slate-950">
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
      </main>

      <Footer />
    </div>
  );
}
