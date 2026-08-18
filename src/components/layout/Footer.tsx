import Link from "next/link"
import { Instagram } from "lucide-react"
import { Logo } from "@/components/layout/Logo"

const footerLinks = [
  { name: "Generator", href: "/generator" },
  { name: "Palettes", href: "/palettes" },
  { name: "Dashboard", href: "/dashboard" },
]

export default function Footer() {
  return (
    <footer className="border-t bg-card/50 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <Logo />
            <p className="text-sm text-muted-foreground max-w-xs">
              Extract, create, and organize color palettes from your images.
            </p>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} BrandZone. All rights reserved.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 sm:gap-12">
            <nav aria-label="Footer">
              <p className="text-sm font-semibold mb-3">Explore</p>
              <ul className="space-y-2">
                {footerLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <p className="text-sm font-semibold mb-3">Connect</p>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
