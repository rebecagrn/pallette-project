# BrandZone

Extract palettes from photos, build them by hand, or generate them from a text prompt. BrandZone is a Next.js app with an optional FastAPI service for AI suggestions.

**Live demo:** [brandzone-project.vercel.app](https://brandzone-project.vercel.app)

https://github.com/user-attachments/assets/cefee8e4-f8ac-485d-8c92-22b6ffecfa36

## What you can do

| Area | Capabilities |
| --- | --- |
| **Generator** | Add images by URL or file, extract colors with ColorThief, enhance with AI, group and tag |
| **Palettes** | Create by hand, search by name/hex/tag, favorite, export/import JSON, generate from a prompt |
| **Dashboard** | Library snapshot, recent items, tag and group usage |

Data lives in the browser (`localStorage` via Zustand). AI generation calls the Python API through Next.js `/api/palettes/*` so the backend URL stays server-side.

Without `OPENAI_API_KEY`, the API still returns palettes using a color-theory fallback.

## Stack

- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS, shadcn/ui, Zustand
- **Color extraction:** ColorThief
- **Backend:** FastAPI, Pydantic, optional OpenAI (`gpt-4o-mini`)

## Prerequisites

- Node.js 18+
- [pnpm](https://pnpm.io/) (recommended)
- Python 3.9+ (for the palette API)

## Setup

```bash
git clone https://github.com/rebecagrn/pallette-project.git
cd pallette-project
pnpm install
cp .env.example .env.local
```

One-time backend setup:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
cd ..
```

Optional — GPT palettes: add `OPENAI_API_KEY` to `backend/.env`.

Run both apps:

```bash
pnpm dev:all
```

Or separately:

```bash
pnpm dev:backend   # FastAPI on http://localhost:8000
pnpm dev           # Next.js on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000).

| Env file | Variable | Purpose |
| --- | --- | --- |
| `.env.local` | `PALETTE_API_URL` | FastAPI origin used by Next.js route handlers (default `http://localhost:8000`) |
| `.env.local` | `PALETTE_API_SECRET` | Optional shared secret forwarded to FastAPI |
| `backend/.env` | `OPENAI_API_KEY` | Enables GPT generation; empty = fallback |
| `backend/.env` | `API_SECRET` | Optional; when set, generate requires `X-Palette-Api-Secret` |
| `backend/.env` | `CORS_ORIGINS` | Allowed frontend origins |

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Next.js dev server |
| `pnpm dev:backend` | FastAPI with reload |
| `pnpm dev:all` | Frontend + backend together |
| `pnpm build` / `pnpm start` | Production frontend |
| `pnpm lint` | ESLint |
| `pnpm test` | Jest |
| `pnpm test:backend` | pytest |

FastAPI docs: [http://localhost:8000/docs](http://localhost:8000/docs)

## How AI generation works

1. The UI posts to `/api/palettes/generate`.
2. Next.js rate-limits by client IP (20/min), validates the body (Zod), and forwards it to FastAPI.
3. FastAPI calls OpenAI when a key is set, otherwise builds a palette from mood/style heuristics.
4. FastAPI also rate-limits generate (20/min) and can require `API_SECRET` so the backend is not a public OpenAI proxy.

Typical payload:

```json
{
  "prompt": "cozy coffee shop brand with warm earthy tones",
  "mood": "warm",
  "style": "minimal",
  "color_count": 5,
  "base_colors": ["#8B4513"]
}
```

From **Generator**, **AI Enhance** on an image card sends extracted colors as `base_colors`. From **Palettes → AI**, you describe the palette in text.

## Project layout

```
backend/                 FastAPI app (routers, schemas, AI service)
src/
├── app/                  Pages and API route handlers
├── components/
│   ├── dashboard-module/
│   ├── images-module/
│   ├── palettes-module/
│   ├── layout/
│   ├── shared/
│   └── ui/
├── lib/                  Color extraction, palette API client
├── store/                Zustand persist store
├── types/
└── validations/          Zod schemas for the proxy
```

## Limitations

- No accounts — everything is local to the browser
- Uploaded files are stored as data URLs (max 1MB) so they survive refresh
- Remote image hosts without CORS often block in-browser color extraction — upload the file instead
- AI needs the FastAPI process running
- Generate is public besides rate limiting; set `API_SECRET` / `PALETTE_API_SECRET` in production
- Dark-mode tokens exist in CSS; there is no theme switch yet

## License

MIT
