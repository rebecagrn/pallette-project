from fastapi.testclient import TestClient

from app.main import app

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


def test_generate_palette_invalid_color_count():
    response = client.post(
        "/api/v1/palettes/generate",
        json={"prompt": "valid prompt here", "color_count": 2},
    )
    assert response.status_code == 422
