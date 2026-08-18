import { getPaletteApiUrl } from "@/lib/paletteApiServer"
import { GeneratePaletteRequest } from "@/types/palette-api"

export async function POST(request: Request) {
  let body: GeneratePaletteRequest
  try {
    body = (await request.json()) as GeneratePaletteRequest
  } catch {
    return Response.json({ detail: "Invalid request body" }, { status: 400 })
  }

  try {
    const response = await fetch(getPaletteApiUrl("/api/v1/palettes/generate"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const data = await response.json()
    return Response.json(data, { status: response.status })
  } catch {
    return Response.json(
      { detail: "Palette API is unavailable. Is the backend running?" },
      { status: 503 }
    )
  }
}
