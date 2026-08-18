import { getPaletteApiUrl } from "@/lib/paletteApiServer"
import { generatePaletteSchema } from "@/validations/palette"

export async function POST(request: Request) {
  let rawBody: unknown
  try {
    rawBody = await request.json()
  } catch {
    return Response.json({ detail: "Invalid request body" }, { status: 400 })
  }

  const parsed = generatePaletteSchema.safeParse(rawBody)
  if (!parsed.success) {
    return Response.json(
      { detail: parsed.error.issues.map((issue) => issue.message).join(", ") },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(getPaletteApiUrl("/api/v1/palettes/generate"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
      signal: AbortSignal.timeout(30000),
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
