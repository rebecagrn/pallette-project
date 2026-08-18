const PALETTE_API_URL =
  process.env.PALETTE_API_URL ?? "http://localhost:8000"

export function getPaletteApiUrl(path: string): string {
  return `${PALETTE_API_URL}${path}`
}
