interface RateLimiterOptions {
  maxRequests: number
  windowMs: number
}

interface RateLimiter {
  isLimited: (key: string) => boolean
}

const MAX_TRACKED_KEYS = 5000

export function createRateLimiter({
  maxRequests,
  windowMs,
}: RateLimiterOptions): RateLimiter {
  const hits = new Map<string, number[]>()

  function prune(now: number): void {
    if (hits.size <= MAX_TRACKED_KEYS) return
    const windowStart = now - windowMs
    for (const [key, timestamps] of hits) {
      const recent = timestamps.filter((timestamp) => timestamp > windowStart)
      if (recent.length === 0) hits.delete(key)
      else hits.set(key, recent)
    }
  }

  function isLimited(key: string): boolean {
    const now = Date.now()
    prune(now)
    const windowStart = now - windowMs
    const recent = (hits.get(key) ?? []).filter(
      (timestamp) => timestamp > windowStart
    )
    if (recent.length >= maxRequests) {
      hits.set(key, recent)
      return true
    }
    recent.push(now)
    hits.set(key, recent)
    return false
  }

  return { isLimited }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim()
    if (first) return first
  }
  return request.headers.get("x-real-ip") ?? "unknown"
}

export const paletteGenerateLimiter = createRateLimiter({
  maxRequests: 20,
  windowMs: 60_000,
})
