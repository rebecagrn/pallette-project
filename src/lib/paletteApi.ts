import {
  GeneratePaletteRequest,
  GeneratePaletteResponse,
  PaletteHealthResponse,
} from "@/types/palette-api"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

class PaletteApiError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message)
    this.name = "PaletteApiError"
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = "Request failed"
    try {
      const errorBody = await response.json()
      if (typeof errorBody.detail === "string") {
        message = errorBody.detail
      } else if (Array.isArray(errorBody.detail)) {
        message = errorBody.detail
          .map((item: { msg?: string }) => item.msg)
          .filter(Boolean)
          .join(", ")
      }
    } catch {
      message = response.statusText || message
    }
    throw new PaletteApiError(message, response.status)
  }
  return response.json() as Promise<T>
}

export async function checkPaletteApiHealth(): Promise<PaletteHealthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/palettes/health`)
  return handleResponse<PaletteHealthResponse>(response)
}

export async function generatePaletteWithAi(
  request: GeneratePaletteRequest
): Promise<GeneratePaletteResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/palettes/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  })
  return handleResponse<GeneratePaletteResponse>(response)
}

export { PaletteApiError }
