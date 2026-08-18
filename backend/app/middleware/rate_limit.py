from collections import defaultdict
from time import time
from typing import DefaultDict, List

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse, Response

GENERATE_PATH_SUFFIX = "/palettes/generate"
MAX_REQUESTS = 20
WINDOW_SECONDS = 60


class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app) -> None:
        super().__init__(app)
        self._hits: DefaultDict[str, List[float]] = defaultdict(list)

    async def dispatch(self, request: Request, call_next) -> Response:
        if request.method != "POST" or not request.url.path.endswith(
            GENERATE_PATH_SUFFIX
        ):
            return await call_next(request)
        client_host = request.client.host if request.client else "unknown"
        now = time()
        window_start = now - WINDOW_SECONDS
        recent_hits = [
            timestamp
            for timestamp in self._hits[client_host]
            if timestamp > window_start
        ]
        if len(recent_hits) >= MAX_REQUESTS:
            return JSONResponse(
                {"detail": "Too many requests. Try again shortly."},
                status_code=429,
            )
        recent_hits.append(now)
        self._hits[client_host] = recent_hits
        return await call_next(request)
