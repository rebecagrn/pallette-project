const PALETTE_API_URL = process.env.PALETTE_API_URL ?? "http://localhost:8000"

export function getPaletteApiUrl(path: string): string {
  const origin = PALETTE_API_URL.replace(/\/$/, "")
  return `${origin}${path}`
}

export function getPaletteApiHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }
  const secret = process.env.PALETTE_API_SECRET
  if (secret) headers["X-Palette-Api-Secret"] = secret
  return headers
}
