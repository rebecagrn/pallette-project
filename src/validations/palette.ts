import { z } from "zod"

export const generatePaletteSchema = z.object({
  prompt: z.string().trim().min(3).max(500),
  mood: z
    .enum(["warm", "cool", "vibrant", "muted", "neutral", "dark", "light"])
    .optional(),
  style: z
    .enum([
      "minimal",
      "retro",
      "nature",
      "tech",
      "luxury",
      "playful",
      "corporate",
      "artistic",
    ])
    .optional(),
  color_count: z.number().int().min(3).max(10).optional(),
  base_colors: z
    .array(z.string().regex(/^#?[0-9A-Fa-f]{6}$/))
    .max(10)
    .optional(),
})
