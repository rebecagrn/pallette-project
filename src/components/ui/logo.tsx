import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="text-2xl font-leckerli text-purple-600 transition-colors"
    >
      BrandZone
    </Link>
  );
}
