from __future__ import annotations

import uuid
from contextvars import ContextVar, Token

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

_REQUEST_ID_CTX: ContextVar[str | None] = ContextVar("request_id", default=None)


def get_request_id() -> str | None:
    return _REQUEST_ID_CTX.get()


def set_request_id(value: str) -> Token[str | None]:
    return _REQUEST_ID_CTX.set(value)


def reset_request_id(token: Token[str | None]) -> None:
    _REQUEST_ID_CTX.reset(token)


class RequestIdMiddleware(BaseHTTPMiddleware):
    """Attach a request id from X-Request-Id or generate one; echo on response."""

    async def dispatch(self, request: Request, call_next):  # type: ignore[override]
        header_rid = request.headers.get("x-request-id")
        rid = header_rid.strip() if header_rid and header_rid.strip() else str(uuid.uuid4())
        token = set_request_id(rid)
        try:
            response: Response = await call_next(request)
            response.headers["X-Request-Id"] = rid
            return response
        finally:
            reset_request_id(token)
