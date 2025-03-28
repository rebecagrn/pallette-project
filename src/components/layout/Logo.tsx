import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="text-2xl font-leckerli text-[#2E8BC0] transition-colors"
    >
      BrandZone
    </Link>
  );
}
