import json
import logging
import random
from typing import Any, Dict, List, Tuple

from openai import AsyncOpenAI

from app.config import settings
from app.schemas.palette import (
    HEX_PATTERN,
    GeneratePaletteRequest,
    GeneratedPalette,
    PaletteMood,
    PaletteStyle,
)

logger = logging.getLogger(__name__)

MOOD_HUES: Dict[PaletteMood, Tuple[float, float]] = {
    PaletteMood.WARM: (10, 50),
    PaletteMood.COOL: (180, 240),
    PaletteMood.VIBRANT: (0, 360),
    PaletteMood.MUTED: (0, 360),
    PaletteMood.NEUTRAL: (0, 60),
    PaletteMood.DARK: (0, 360),
    PaletteMood.LIGHT: (0, 360),
}

STYLE_SATURATION: Dict[PaletteStyle, Tuple[float, float]] = {
    PaletteStyle.MINIMAL: (5, 25),
    PaletteStyle.RETRO: (55, 85),
    PaletteStyle.NATURE: (35, 65),
    PaletteStyle.TECH: (45, 75),
    PaletteStyle.LUXURY: (25, 55),
    PaletteStyle.PLAYFUL: (60, 90),
    PaletteStyle.CORPORATE: (20, 45),
    PaletteStyle.ARTISTIC: (50, 95),
}


def _hue_to_rgb(hue: float, saturation: float, lightness: float) -> Tuple[int, int, int]:
    chroma = (1 - abs(2 * lightness - 1)) * saturation
    hue_segment = (hue / 60) % 6
    x = chroma * (1 - abs(hue_segment % 2 - 1))
    if hue_segment < 1:
        red, green, blue = chroma, x, 0
    elif hue_segment < 2:
        red, green, blue = x, chroma, 0
    elif hue_segment < 3:
        red, green, blue = 0, chroma, x
    elif hue_segment < 4:
        red, green, blue = 0, x, chroma
    elif hue_segment < 5:
        red, green, blue = x, 0, chroma
    else:
        red, green, blue = chroma, 0, x
    match_value = lightness - chroma / 2
    return (
        round((red + match_value) * 255),
        round((green + match_value) * 255),
        round((blue + match_value) * 255),
    )


def _rgb_to_hex(red: int, green: int, blue: int) -> str:
    return f"#{red:02X}{green:02X}{blue:02X}"


def _generate_fallback_palette(request: GeneratePaletteRequest) -> GeneratedPalette:
    mood = request.mood or _infer_mood_from_prompt(request.prompt)
    style = request.style or _infer_style_from_prompt(request.prompt)
    hue_range = MOOD_HUES[mood]
    sat_range = STYLE_SATURATION[style]
    lightness_range = _get_lightness_range(mood)
    colors: List[str] = []
    if request.base_colors:
        colors.extend(request.base_colors[: request.color_count])
    seed = sum(ord(char) for char in request.prompt.lower())
    rng = random.Random(seed)
    while len(colors) < request.color_count:
        hue = rng.uniform(hue_range[0], hue_range[1])
        saturation = rng.uniform(sat_range[0], sat_range[1]) / 100
        lightness = rng.uniform(lightness_range[0], lightness_range[1]) / 100
        hex_color = _rgb_to_hex(*_hue_to_rgb(hue, saturation, lightness))
        if hex_color not in colors:
            colors.append(hex_color)
    name = _build_palette_name(request.prompt, mood, style)
    description = (
        f"Rule-based palette inspired by \"{request.prompt}\" "
        f"with {mood.value} mood and {style.value} style."
    )
    return GeneratedPalette(
        name=name,
        colors=colors[: request.color_count],
        description=description,
        mood=mood.value,
        style=style.value,
        source="fallback",
    )


def _infer_mood_from_prompt(prompt: str) -> PaletteMood:
    lowered = prompt.lower()
    mood_keywords: Dict[PaletteMood, List[str]] = {
        PaletteMood.WARM: ["warm", "sunset", "cozy", "autumn", "fire", "golden"],
        PaletteMood.COOL: ["cool", "ocean", "ice", "winter", "calm", "blue"],
        PaletteMood.VIBRANT: ["vibrant", "bold", "energetic", "bright", "neon"],
        PaletteMood.MUTED: ["muted", "soft", "pastel", "subtle", "gentle"],
        PaletteMood.NEUTRAL: ["neutral", "gray", "beige", "earth", "sand"],
        PaletteMood.DARK: ["dark", "night", "moody", "noir", "shadow"],
        PaletteMood.LIGHT: ["light", "airy", "fresh", "clean", "white"],
    }
    for mood, keywords in mood_keywords.items():
        if any(keyword in lowered for keyword in keywords):
            return mood
    return PaletteMood.NEUTRAL


def _infer_style_from_prompt(prompt: str) -> PaletteStyle:
    lowered = prompt.lower()
    style_keywords: Dict[PaletteStyle, List[str]] = {
        PaletteStyle.MINIMAL: ["minimal", "simple", "clean", "modern"],
        PaletteStyle.RETRO: ["retro", "vintage", "70s", "80s", "nostalgic"],
        PaletteStyle.NATURE: ["nature", "forest", "organic", "botanical", "green"],
        PaletteStyle.TECH: ["tech", "digital", "cyber", "startup", "saas"],
        PaletteStyle.LUXURY: ["luxury", "premium", "elegant", "gold", "chic"],
        PaletteStyle.PLAYFUL: ["playful", "fun", "kids", "candy", "bright"],
        PaletteStyle.CORPORATE: ["corporate", "business", "professional", "brand"],
        PaletteStyle.ARTISTIC: ["artistic", "creative", "gallery", "expressive"],
    }
    for style, keywords in style_keywords.items():
        if any(keyword in lowered for keyword in keywords):
            return style
    return PaletteStyle.MINIMAL


def _get_lightness_range(mood: PaletteMood) -> Tuple[float, float]:
    if mood == PaletteMood.DARK:
        return (15, 40)
    if mood == PaletteMood.LIGHT:
        return (70, 92)
    if mood == PaletteMood.MUTED:
        return (45, 70)
    if mood == PaletteMood.VIBRANT:
        return (40, 65)
    return (35, 75)


def _build_palette_name(prompt: str, mood: PaletteMood, style: PaletteStyle) -> str:
    words = [word.capitalize() for word in prompt.split()[:3] if word.isalnum()]
    base = " ".join(words) if words else "Custom"
    return f"{base} {style.value.title()} Palette"


def _parse_ai_response(content: str, request: GeneratePaletteRequest) -> GeneratedPalette:
    try:
        payload: Dict[str, Any] = json.loads(content)
    except json.JSONDecodeError as error:
        raise ValueError("AI returned invalid JSON") from error
    colors = payload.get("colors", [])
    if not isinstance(colors, list) or len(colors) < 3:
        raise ValueError("AI response missing valid colors")
    normalized_colors: List[str] = []
    for color in colors:
        if not isinstance(color, str):
            continue
        normalized = color.strip().upper()
        if not normalized.startswith("#"):
            normalized = f"#{normalized}"
        if HEX_PATTERN.match(normalized):
            normalized_colors.append(normalized)
    if len(normalized_colors) < 3:
        raise ValueError("AI response did not include enough valid hex colors")
    name = payload.get("name")
    if not isinstance(name, str) or not name.strip():
        name = _build_palette_name(
            request.prompt,
            request.mood or PaletteMood.NEUTRAL,
            request.style or PaletteStyle.MINIMAL,
        )
    description = payload.get("description")
    if not isinstance(description, str) or not description.strip():
        description = f"AI-generated palette for: {request.prompt}"
    return GeneratedPalette(
        name=name.strip(),
        colors=normalized_colors[: request.color_count],
        description=description.strip(),
        mood=request.mood.value if request.mood else payload.get("mood"),
        style=request.style.value if request.style else payload.get("style"),
        source="ai",
    )


async def generate_palette_with_ai(request: GeneratePaletteRequest) -> GeneratedPalette:
    if not settings.has_openai:
        return _generate_fallback_palette(request)
    client = AsyncOpenAI(api_key=settings.openai_api_key)
    mood_hint = request.mood.value if request.mood else "infer from prompt"
    style_hint = request.style.value if request.style else "infer from prompt"
    base_colors_hint = ", ".join(request.base_colors) if request.base_colors else "none"
    system_prompt = (
        "You are a professional color designer. Return ONLY valid JSON with keys: "
        "name (string), description (string), colors (array of exactly "
        f"{request.color_count} hex colors like #FF5733), mood (string), style (string)."
    )
    user_prompt = (
        f"Create a color palette for: {request.prompt}\n"
        f"Mood preference: {mood_hint}\n"
        f"Style preference: {style_hint}\n"
        f"Base colors to incorporate if possible: {base_colors_hint}\n"
        f"Return exactly {request.color_count} harmonious hex colors."
    )
    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.8,
            response_format={"type": "json_object"},
        )
        content = response.choices[0].message.content
        if not content:
            raise ValueError("Empty AI response")
        return _parse_ai_response(content, request)
    except Exception:
        logger.exception("OpenAI palette generation failed; using fallback")
        return _generate_fallback_palette(request)
