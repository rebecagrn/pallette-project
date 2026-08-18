# BrandZone Palette API

FastAPI backend for AI-powered color palette generation.

## Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

Optional: set `OPENAI_API_KEY` in `.env` for GPT-powered suggestions. Without it, the API uses a rule-based color theory fallback.

## Run

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API docs: [http://localhost:8000/docs](http://localhost:8000/docs)

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Service health check |
| GET | `/api/v1/palettes/health` | Palette service status and AI availability |
| POST | `/api/v1/palettes/generate` | Generate palette from prompt |

### Generate palette

```json
POST /api/v1/palettes/generate
{
  "prompt": "cozy coffee shop brand with warm earthy tones",
  "mood": "warm",
  "style": "minimal",
  "color_count": 5,
  "base_colors": ["#8B4513"]
}
```

Response:

```json
{
  "palette": {
    "name": "Cozy Coffee Minimal Palette",
    "colors": ["#8B4513", "#D4A574", "#F5E6D3", "#4A3728", "#C17F59"],
    "description": "Warm earthy palette for a cozy coffee brand",
    "mood": "warm",
    "style": "minimal",
    "source": "ai"
  }
}
```
