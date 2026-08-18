import { useStore } from "@/store/appStore"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ImageProps } from "@/types"
import AddImageForm from "./AddImageForm"
import ImageGrid from "./ImageGrid"
import ImagesHeader from "./ImagesHeader"
import GroupManager from "./GroupManager"
import { ImagePlus, Palette, Sparkles } from "lucide-react"

const steps = [
  {
    icon: ImagePlus,
    title: "Add an image",
    text: "Paste a URL or upload a file",
  },
  {
    icon: Palette,
    title: "Extract colors",
    text: "Pull a palette from the photo",
  },
  {
    icon: Sparkles,
    title: "Enhance with AI",
    text: "Get a more harmonious set",
  },
]

export default function ImagesModule() {
  const {
    images,
    viewMode,
    sortBy,
    showAddImageDialog,
    removeImage,
    updateImage,
    setViewMode,
    setSortBy,
    setShowAddImageDialog,
  } = useStore()

  const sortedImages = [...images].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
      case "name":
        return a.url.localeCompare(b.url)
      default:
        return 0
    }
  })

  const handleDelete = (id: string) => {
    removeImage(id)
  }

  const handleEdit = (id: string, data: Partial<ImageProps>) => {
    updateImage(id, data)
  }

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl border bg-card/90 p-5 sm:p-6 shadow-sm">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_hsl(var(--brand-light)/0.16),_transparent_55%)]" />
        <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {steps.map((step, index) => (
            <div key={step.title} className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <step.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Step {index + 1}
                </p>
                <p className="font-semibold mt-0.5">{step.title}</p>
                <p className="text-sm text-muted-foreground">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-4 sm:space-y-5 min-w-0">
          <ImagesHeader
            totalImages={images.length}
            onAddClick={() => setShowAddImageDialog(true)}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          <ImageGrid
            images={sortedImages}
            onDelete={handleDelete}
            onEdit={handleEdit}
            viewMode={viewMode}
            onAddClick={() => setShowAddImageDialog(true)}
          />
        </div>

        <div className="lg:sticky lg:top-20 lg:self-start">
          <GroupManager />
        </div>
      </div>

      <Dialog open={showAddImageDialog} onOpenChange={setShowAddImageDialog}>
        <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add image</DialogTitle>
          </DialogHeader>
          <AddImageForm onSuccess={() => setShowAddImageDialog(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
