import { z } from "zod"

export const hexColorSchema = z
  .string()
  .trim()
  .regex(/^#?[0-9A-Fa-f]{6}$/, "Invalid hex color")
  .transform((value) => {
    const normalized = value.toUpperCase()
    return normalized.startsWith("#") ? normalized : `#${normalized}`
  })

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
  base_colors: z.array(hexColorSchema).max(10).optional(),
})

const importedCommentSchema = z.object({
  text: z.string().trim().min(1).max(2000),
  id: z.string().min(1).optional(),
  imageId: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export const importedPaletteSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  colors: z.array(hexColorSchema).min(1).max(20),
  tagIds: z.array(z.string().min(1)).max(50).optional(),
  groupIds: z.array(z.string().min(1)).max(50).optional(),
  comments: z.array(importedCommentSchema).max(50).optional(),
})

export function parseImportedPalette(input: unknown) {
  return importedPaletteSchema.safeParse(input)
}
