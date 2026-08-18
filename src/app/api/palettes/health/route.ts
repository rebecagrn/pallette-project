import { getPaletteApiHeaders, getPaletteApiUrl } from "@/lib/paletteApiServer"
import { PaletteHealthResponse } from "@/types/palette-api"

export async function GET() {
  try {
    const response = await fetch(getPaletteApiUrl("/api/v1/palettes/health"), {
      headers: getPaletteApiHeaders(),
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    })
    const data = (await response.json()) as PaletteHealthResponse
    return Response.json(data, { status: response.status })
  } catch {
    return Response.json(
      { status: "error", ai_enabled: false },
      { status: 503 }
    )
  }
}
