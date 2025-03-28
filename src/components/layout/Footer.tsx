import Link from "next/link";
import { Instagram } from "lucide-react";
import { Logo } from "../ui/logo";

export default function Footer() {
  return (
    <footer className="border-t border-gray-950">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-8">
            <Logo />
            <p className="text-sm text-black">
              © {new Date().getFullYear()}, All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-8">
            <nav className="flex gap-8">
              <Link
                href="/app"
                className="text-black hover:text-[#145DA0] transition-colors"
              >
                Launch App
              </Link>
            </nav>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-[#145DA0] transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
