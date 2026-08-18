from typing import Dict

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.middleware.rate_limit import RateLimitMiddleware
from app.routers import palette

app = FastAPI(
    title="BrandZone Palette API",
    description="AI-powered color palette generation for BrandZone",
    version="1.0.0",
)

app.add_middleware(RateLimitMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(palette.router, prefix="/api/v1")


@app.get("/health")
async def health_check() -> Dict[str, str]:
    return {"status": "ok"}
