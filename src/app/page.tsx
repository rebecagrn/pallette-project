import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DEMO_COLOR_PALETTES, DEMO_PALETTE_COLORS } from "@/types/constants"
import { Sparkles, Palette, ImagePlus, BarChart3 } from "lucide-react"

const features = [
  {
    icon: ImagePlus,
    title: "Extract from images",
    description:
      "Upload any photo and instantly pull harmonious color combinations.",
  },
  {
    icon: Sparkles,
    title: "AI suggestions",
    description:
      "Describe a mood or brand and get curated palettes powered by AI.",
  },
  {
    icon: Palette,
    title: "Organize palettes",
    description:
      "Tag, group, favorite, and export palettes for your design workflow.",
  },
  {
    icon: BarChart3,
    title: "Track usage",
    description:
      "See stats on your images, palettes, tags, and groups at a glance.",
  },
]

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="page-shell pb-12 sm:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-6 animate-fade-up">
            <p className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Color tools for designers
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              Get beautiful palettes from your photos
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl">
              Upload an image, extract colors, or let AI suggest the perfect
              palette for your brand, mood board, or next project.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/generator" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto">
                  Upload an image
                </Button>
              </Link>
              <Link href="/palettes" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Browse palettes
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative animate-fade-up [animation-delay:150ms]">
            <div className="surface-card p-3 sm:p-4">
              <div className="aspect-square rounded-lg overflow-hidden">
                <Image
                  src="/assets/images/demo-palette.jpg"
                  alt="Color palette demo"
                  className="object-cover w-full h-full"
                  width={700}
                  height={700}
                  priority
                />
              </div>
              <div className="mt-3 space-y-2">
                <div className="grid grid-cols-4 gap-1.5">
                  {DEMO_PALETTE_COLORS.map((color) => (
                    <div
                      key={color.hex}
                      className="h-10 sm:h-14 rounded-md transition-transform hover:scale-105"
                      style={{ backgroundColor: color.color }}
                      title={color.hex}
                    />
                  ))}
                </div>
                <div className="hidden sm:grid grid-cols-4 gap-1.5">
                  {DEMO_PALETTE_COLORS.map((color) => (
                    <div
                      key={`name-${color.hex}`}
                      className="text-center text-xs font-medium text-muted-foreground truncate"
                    >
                      {color.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y bg-card/40 py-12 sm:py-16">
        <div className="page-shell py-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 sm:mb-12">
            Everything you need to work with color
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="p-5 sm:p-6 border bg-background/80 hover:shadow-md transition-shadow"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-10">
          Explore palette inspiration
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
          {DEMO_COLOR_PALETTES.map((palette, index) => (
            <Card
              key={index}
              className="overflow-hidden p-0 hover:shadow-md transition-shadow cursor-default"
            >
              <div className="flex h-16 sm:h-20">
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
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link href="/generator" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto">
              Start generating
            </Button>
          </Link>
          <Link href="/palettes" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Create custom palette
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
