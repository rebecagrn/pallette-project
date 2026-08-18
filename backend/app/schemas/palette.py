from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field, field_validator


class PaletteMood(str, Enum):
    WARM = "warm"
    COOL = "cool"
    VIBRANT = "vibrant"
    MUTED = "muted"
    NEUTRAL = "neutral"
    DARK = "dark"
    LIGHT = "light"


class PaletteStyle(str, Enum):
    MINIMAL = "minimal"
    RETRO = "retro"
    NATURE = "nature"
    TECH = "tech"
    LUXURY = "luxury"
    PLAYFUL = "playful"
    CORPORATE = "corporate"
    ARTISTIC = "artistic"


class GeneratePaletteRequest(BaseModel):
    prompt: str = Field(
        min_length=3,
        max_length=500,
        description="Describe the palette you want (mood, brand, scene, etc.)",
    )
    mood: Optional[PaletteMood] = None
    style: Optional[PaletteStyle] = None
    color_count: int = Field(default=5, ge=3, le=10)
    base_colors: List[str] = Field(default_factory=list, max_length=5)

    @field_validator("base_colors")
    @classmethod
    def validate_hex_colors(cls, colors: List[str]) -> List[str]:
        validated: List[str] = []
        for color in colors:
            normalized = color.strip().upper()
            if not normalized.startswith("#"):
                normalized = f"#{normalized}"
            if len(normalized) != 7:
                raise ValueError(f"Invalid hex color: {color}")
            validated.append(normalized)
        return validated


class GeneratedPalette(BaseModel):
    name: str
    colors: List[str]
    description: str
    mood: Optional[str] = None
    style: Optional[str] = None
    source: str = Field(description="ai or fallback")


class GeneratePaletteResponse(BaseModel):
    palette: GeneratedPalette


class HealthResponse(BaseModel):
    status: str
    ai_enabled: bool
