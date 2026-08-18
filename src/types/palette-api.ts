export type PaletteMood =
  | "warm"
  | "cool"
  | "vibrant"
  | "muted"
  | "neutral"
  | "dark"
  | "light"

export type PaletteStyle =
  | "minimal"
  | "retro"
  | "nature"
  | "tech"
  | "luxury"
  | "playful"
  | "corporate"
  | "artistic"

export interface GeneratePaletteRequest {
  prompt: string
  mood?: PaletteMood
  style?: PaletteStyle
  color_count?: number
  base_colors?: string[]
}

export interface GeneratedPalette {
  name: string
  colors: string[]
  description: string
  mood?: string
  style?: string
  source: "ai" | "fallback"
}

export interface GeneratePaletteResponse {
  palette: GeneratedPalette
}

export interface PaletteHealthResponse {
  status: string
  ai_enabled: boolean
}
