from fastapi import APIRouter

from app.config import settings
from app.schemas.palette import (
    GeneratePaletteRequest,
    GeneratePaletteResponse,
    HealthResponse,
)
from app.services.ai_palette_service import generate_palette_with_ai

router = APIRouter(prefix="/palettes", tags=["palettes"])


@router.get("/health", response_model=HealthResponse)
async def get_palette_health() -> HealthResponse:
    return HealthResponse(status="ok", ai_enabled=settings.has_openai)


@router.post("/generate", response_model=GeneratePaletteResponse)
async def generate_palette(request: GeneratePaletteRequest) -> GeneratePaletteResponse:
    palette = await generate_palette_with_ai(request)
    return GeneratePaletteResponse(palette=palette)
