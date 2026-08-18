import Link from "next/link"

export function Logo() {
  return (
    <Link
      href="/"
      className="text-xl sm:text-2xl font-leckerli text-brand-light hover:text-brand transition-colors"
    >
      BrandZone
    </Link>
  )
}
