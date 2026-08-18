import {
  hexColorSchema,
  parseImportedPalette,
} from "../validations/palette"

describe("hexColorSchema", () => {
  it("normalizes hex without a hash", () => {
    expect(hexColorSchema.parse("ff5733")).toBe("#FF5733")
  })

  it("rejects invalid hex", () => {
    expect(hexColorSchema.safeParse("#GGGGGG").success).toBe(false)
  })
})

describe("parseImportedPalette", () => {
  it("accepts a valid palette and normalizes colors", () => {
    const parsed = parseImportedPalette({
      name: "Sunset",
      colors: ["#ff0000", "00FF00"],
    })
    expect(parsed.success).toBe(true)
    if (!parsed.success) return
    expect(parsed.data.colors).toEqual(["#FF0000", "#00FF00"])
  })

  it("rejects palettes without colors", () => {
    const parsed = parseImportedPalette({ name: "Empty" })
    expect(parsed.success).toBe(false)
  })

  it("rejects non-hex colors", () => {
    const parsed = parseImportedPalette({
      name: "Bad",
      colors: ["red", "#00FF00"],
    })
    expect(parsed.success).toBe(false)
  })
})
