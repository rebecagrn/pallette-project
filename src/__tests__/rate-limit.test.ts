import { createRateLimiter, getClientIp } from "../lib/rate-limit"

describe("createRateLimiter", () => {
  it("allows requests under the max and blocks afterwards", () => {
    const limiter = createRateLimiter({ maxRequests: 3, windowMs: 60_000 })

    expect(limiter.isLimited("1.1.1.1")).toBe(false)
    expect(limiter.isLimited("1.1.1.1")).toBe(false)
    expect(limiter.isLimited("1.1.1.1")).toBe(false)
    expect(limiter.isLimited("1.1.1.1")).toBe(true)
  })

  it("tracks keys independently", () => {
    const limiter = createRateLimiter({ maxRequests: 1, windowMs: 60_000 })

    expect(limiter.isLimited("a")).toBe(false)
    expect(limiter.isLimited("b")).toBe(false)
    expect(limiter.isLimited("a")).toBe(true)
  })
})

describe("getClientIp", () => {
  function fakeRequest(headers: Record<string, string>): Request {
    return {
      headers: {
        get: (name: string) => headers[name] ?? null,
      },
    } as Request
  }

  it("uses the first x-forwarded-for address", () => {
    const request = fakeRequest({
      "x-forwarded-for": "203.0.113.10, 10.0.0.1",
    })
    expect(getClientIp(request)).toBe("203.0.113.10")
  })

  it("falls back to x-real-ip", () => {
    const request = fakeRequest({ "x-real-ip": "198.51.100.2" })
    expect(getClientIp(request)).toBe("198.51.100.2")
  })
})
