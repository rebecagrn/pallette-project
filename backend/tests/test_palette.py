import json

from fastapi.testclient import TestClient
from starlette.applications import Starlette
from starlette.responses import JSONResponse
from starlette.routing import Route
from starlette.testclient import TestClient as StarletteTestClient

from app.main import app
from app.middleware.rate_limit import MAX_REQUESTS, RateLimitMiddleware
from app.schemas.palette import GeneratePaletteRequest
from app.services.ai_palette_service import _parse_ai_response

client = TestClient(app)


def test_root_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_palette_health():
    response = client.get("/api/v1/palettes/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "ai_enabled" in data


def test_generate_palette_fallback():
    response = client.post(
        "/api/v1/palettes/generate",
        json={"prompt": "warm sunset over the ocean", "color_count": 5},
    )
    assert response.status_code == 200
    data = response.json()
    palette = data["palette"]
    assert len(palette["colors"]) == 5
    assert palette["source"] in ("ai", "fallback")
    assert palette["name"]
    assert palette["description"]


def test_generate_palette_with_mood_and_style():
    response = client.post(
        "/api/v1/palettes/generate",
        json={
            "prompt": "luxury spa brand",
            "mood": "muted",
            "style": "luxury",
            "color_count": 4,
        },
    )
    assert response.status_code == 200
    palette = response.json()["palette"]
    assert len(palette["colors"]) == 4
    assert palette["mood"] == "muted"
    assert palette["style"] == "luxury"


def test_generate_palette_with_base_colors():
    response = client.post(
        "/api/v1/palettes/generate",
        json={
            "prompt": "expand this palette harmoniously",
            "base_colors": ["#FF5733", "#C70039"],
            "color_count": 5,
        },
    )
    assert response.status_code == 200
    colors = response.json()["palette"]["colors"]
    assert "#FF5733" in colors
    assert "#C70039" in colors


def test_generate_palette_invalid_prompt():
    response = client.post(
        "/api/v1/palettes/generate",
        json={"prompt": "ab", "color_count": 5},
    )
    assert response.status_code == 422


def test_generate_palette_with_six_base_colors():
    response = client.post(
        "/api/v1/palettes/generate",
        json={
            "prompt": "expand this palette harmoniously",
            "base_colors": [
                "#FF5733",
                "#C70039",
                "#900C3F",
                "#581845",
                "#1A5276",
                "#117A65",
            ],
            "color_count": 6,
        },
    )
    assert response.status_code == 200
    colors = response.json()["palette"]["colors"]
    assert "#FF5733" in colors
    assert len(colors) == 6


def test_generate_palette_rejects_invalid_hex():
    response = client.post(
        "/api/v1/palettes/generate",
        json={
            "prompt": "valid prompt here",
            "base_colors": ["#GGGGGG"],
            "color_count": 5,
        },
    )
    assert response.status_code == 422


def test_generate_palette_invalid_color_count():
    response = client.post(
        "/api/v1/palettes/generate",
        json={"prompt": "valid prompt here", "color_count": 2},
    )
    assert response.status_code == 422


def test_generate_palette_rejects_whitespace_prompt():
    response = client.post(
        "/api/v1/palettes/generate",
        json={"prompt": "   ", "color_count": 5},
    )
    assert response.status_code == 422


def test_parse_ai_response_pads_to_color_count():
    request = GeneratePaletteRequest(
        prompt="warm sunset over the ocean",
        color_count=5,
    )
    content = json.dumps(
        {
            "name": "Short Palette",
            "description": "Only three colors",
            "colors": ["#FF0000", "#00FF00", "#0000FF"],
            "mood": "warm",
            "style": "minimal",
        }
    )
    palette = _parse_ai_response(content, request)
    assert len(palette.colors) == 5
    assert palette.colors[:3] == ["#FF0000", "#00FF00", "#0000FF"]


def test_generate_rate_limit():
    async def generate(_request):
        return JSONResponse({"ok": True})

    isolated_app = Starlette(
        routes=[
            Route("/api/v1/palettes/generate", generate, methods=["POST"]),
        ]
    )
    isolated_app.add_middleware(RateLimitMiddleware)
    isolated_client = StarletteTestClient(isolated_app)
    for _ in range(MAX_REQUESTS):
        response = isolated_client.post("/api/v1/palettes/generate")
        assert response.status_code == 200
    limited = isolated_client.post("/api/v1/palettes/generate")
    assert limited.status_code == 429

