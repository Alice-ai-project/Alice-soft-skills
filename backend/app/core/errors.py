from __future__ import annotations

from typing import Any

from fastapi import HTTPException, Request, status
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.core.request_id import get_request_id


def _error_body(code: str, message: str, request_id: str | None, extra: dict[str, Any] | None = None) -> dict[str, Any]:
    body: dict[str, Any] = {
        "error": {
            "code": code,
            "message": message,
            "request_id": request_id,
        }
    }
    if extra:
        body["error"].update(extra)
    return body


class AppError(Exception):
    """Application error with stable code and HTTP status."""

    def __init__(self, code: str, message: str, status_code: int = status.HTTP_400_BAD_REQUEST) -> None:
        super().__init__(message)
        self.code = code
        self.message = message
        self.status_code = status_code


class NotFoundError(AppError):
    def __init__(self, code: str, message: str) -> None:
        super().__init__(code, message, status_code=status.HTTP_404_NOT_FOUND)


class DomainError(AppError):
    def __init__(self, code: str, message: str) -> None:
        super().__init__(code, message, status_code=status.HTTP_400_BAD_REQUEST)


class InfrastructureError(AppError):
    def __init__(self, code: str, message: str) -> None:
        super().__init__(code, message, status_code=status.HTTP_503_SERVICE_UNAVAILABLE)


async def app_error_handler(request: Request, exc: AppError) -> JSONResponse:
    rid = get_request_id()
    return JSONResponse(
        status_code=exc.status_code,
        content=jsonable_encoder(_error_body(exc.code, exc.message, rid)),
    )


async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    rid = get_request_id()
    detail = exc.detail
    if isinstance(detail, dict) and "code" in detail and "message" in detail:
        message = str(detail["message"])
        code = str(detail["code"])
        return JSONResponse(
            status_code=exc.status_code,
            content=jsonable_encoder(_error_body(code, message, rid)),
        )
    message = detail if isinstance(detail, str) else "Request failed"
    code = "http_error"
    if exc.status_code == status.HTTP_401_UNAUTHORIZED:
        code = "unauthorized"
    elif exc.status_code == status.HTTP_404_NOT_FOUND:
        code = "not_found"
    return JSONResponse(
        status_code=exc.status_code,
        content=jsonable_encoder(_error_body(code, message, rid)),
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    rid = get_request_id()
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content=jsonable_encoder(
            _error_body(
                "invalid_payload",
                "Validation failed",
                rid,
                extra={"details": exc.errors()},
            )
        ),
    )
