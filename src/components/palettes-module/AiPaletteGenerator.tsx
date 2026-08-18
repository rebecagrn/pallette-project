"use client"

import { useEffect, useState } from "react"
import { Sparkles, Loader2, Save, RefreshCw } from "lucide-react"
import { useStore } from "@/store/appStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { showErrorToast, showSuccessToast } from "@/lib/toast"
import {
  checkPaletteApiHealth,
  generatePaletteWithAi,
  PaletteApiError,
} from "@/lib/paletteApi"
import {
  GeneratedPalette,
  PaletteMood,
  PaletteStyle,
} from "@/types/palette-api"

const MOOD_OPTIONS: { value: PaletteMood; label: string }[] = [
  { value: "warm", label: "Warm" },
  { value: "cool", label: "Cool" },
  { value: "vibrant", label: "Vibrant" },
  { value: "muted", label: "Muted" },
  { value: "neutral", label: "Neutral" },
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
]

const STYLE_OPTIONS: { value: PaletteStyle; label: string }[] = [
  { value: "minimal", label: "Minimal" },
  { value: "retro", label: "Retro" },
  { value: "nature", label: "Nature" },
  { value: "tech", label: "Tech" },
  { value: "luxury", label: "Luxury" },
  { value: "playful", label: "Playful" },
  { value: "corporate", label: "Corporate" },
  { value: "artistic", label: "Artistic" },
]

const PROMPT_SUGGESTIONS = [
  "Modern SaaS dashboard with calm blue tones",
  "Cozy coffee shop brand with warm earthy colors",
  "Playful kids app with bright candy colors",
  "Luxury skincare brand with elegant neutrals",
  "Retro 80s poster with neon accents",
]

interface AiPaletteGeneratorProps {
  onSaved?: () => void
}

export function AiPaletteGenerator({ onSaved }: AiPaletteGeneratorProps) {
  const { addPalette } = useStore()
  const [prompt, setPrompt] = useState("")
  const [mood, setMood] = useState<PaletteMood | "">("")
  const [style, setStyle] = useState<PaletteStyle | "">("")
  const [colorCount, setColorCount] = useState("5")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [generatedPalette, setGeneratedPalette] =
    useState<GeneratedPalette | null>(null)
  const [isAiEnabled, setIsAiEnabled] = useState<boolean | null>(null)

  useEffect(() => {
    checkPaletteApiHealth()
      .then((health) => setIsAiEnabled(health.ai_enabled))
      .catch(() => setIsAiEnabled(null))
  }, [])

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showErrorToast("Please describe the palette you want")
      return
    }
    setIsGenerating(true)
    setGeneratedPalette(null)
    try {
      const response = await generatePaletteWithAi({
        prompt: prompt.trim(),
        mood: mood || undefined,
        style: style || undefined,
        color_count: Number(colorCount),
      })
      setGeneratedPalette(response.palette)
      showSuccessToast(
        response.palette.source === "ai"
          ? "AI palette generated"
          : "Palette generated (rule-based fallback)"
      )
    } catch (error) {
      const message =
        error instanceof PaletteApiError
          ? error.message
          : "Could not reach the palette API. Is the backend running?"
      showErrorToast(message)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSavePalette = async () => {
    if (!generatedPalette) return
    setIsSaving(true)
    try {
      addPalette({
        name: generatedPalette.name,
        colors: generatedPalette.colors,
        groupIds: [],
        tagIds: [],
        comments: [
          {
            id: crypto.randomUUID(),
            imageId: "",
            text: generatedPalette.description,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        isFavorite: false,
      })
      showSuccessToast("Palette saved to your collection")
      onSaved?.()
    } catch {
      showErrorToast("Failed to save palette")
    } finally {
      setIsSaving(false)
    }
  }

  const handleUseSuggestion = (suggestion: string) => {
    setPrompt(suggestion)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              AI Palette Generator
            </CardTitle>
            {isAiEnabled !== null && (
              <Badge variant={isAiEnabled ? "default" : "secondary"}>
                {isAiEnabled ? "GPT enabled" : "Rule-based mode"}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ai-prompt">Describe your palette</Label>
            <Textarea
              id="ai-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A calming ocean-inspired palette for a wellness app"
              rows={3}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {PROMPT_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleUseSuggestion(suggestion)}
                className="text-xs px-2 py-1 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Mood</Label>
              <Select
                value={mood}
                onValueChange={(value) => setMood(value as PaletteMood)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Auto-detect" />
                </SelectTrigger>
                <SelectContent>
                  {MOOD_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Style</Label>
              <Select
                value={style}
                onValueChange={(value) => setStyle(value as PaletteStyle)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Auto-detect" />
                </SelectTrigger>
                <SelectContent>
                  {STYLE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color-count">Colors</Label>
              <Input
                id="color-count"
                type="number"
                min={3}
                max={10}
                value={colorCount}
                onChange={(e) => setColorCount(e.target.value)}
              />
            </div>
          </div>

          <Button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-black hover:bg-slate-950"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Palette
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedPalette && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>{generatedPalette.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {generatedPalette.description}
                </p>
              </div>
              <Badge variant="outline">
                {generatedPalette.source === "ai" ? "AI" : "Fallback"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex h-24 rounded-lg overflow-hidden border">
              {generatedPalette.colors.map((color) => (
                <div
                  key={color}
                  className="flex-1 flex flex-col justify-end p-2 min-w-0"
                  style={{ backgroundColor: color }}
                  title={color}
                >
                  <span className="text-[10px] font-mono bg-black/40 text-white px-1 py-0.5 rounded self-start">
                    {color}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                onClick={handleSavePalette}
                disabled={isSaving}
                className="flex-1 bg-black hover:bg-slate-950"
              >
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save to Collection
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
