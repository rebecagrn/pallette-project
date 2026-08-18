from typing import Annotated, Optional

from fastapi import APIRouter, Depends, Header, HTTPException, status

from app.config import settings
from app.schemas.palette import (
    GeneratePaletteRequest,
    GeneratePaletteResponse,
    HealthResponse,
)
from app.services.ai_palette_service import generate_palette_with_ai

router = APIRouter(prefix="/palettes", tags=["palettes"])


def verify_api_secret(
    x_palette_api_secret: Annotated[Optional[str], Header()] = None,
) -> None:
    expected = settings.api_secret.strip()
    if not expected:
        return
    if x_palette_api_secret != expected:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized",
        )


@router.get("/health", response_model=HealthResponse)
async def get_palette_health() -> HealthResponse:
    return HealthResponse(status="ok", ai_enabled=settings.has_openai)


@router.post(
    "/generate",
    response_model=GeneratePaletteResponse,
    dependencies=[Depends(verify_api_secret)],
)
async def generate_palette(request: GeneratePaletteRequest) -> GeneratePaletteResponse:
    palette = await generate_palette_with_ai(request)
    return GeneratePaletteResponse(palette=palette)
