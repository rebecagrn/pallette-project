import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="page-shell flex items-center justify-center min-h-[60vh]">
      <div className="max-w-md text-center space-y-6">
        <p className="text-7xl sm:text-8xl font-bold text-primary/20">404</p>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold">Page not found</h1>
          <p className="text-muted-foreground">
            The page you are looking for does not exist or may have been moved.
          </p>
        </div>
        <Link href="/">
          <Button size="lg">
            <Home className="mr-2 h-4 w-4" />
            Return home
          </Button>
        </Link>
      </div>
    </div>
  )
}
