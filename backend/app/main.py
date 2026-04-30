from fastapi import FastAPI

app = FastAPI(
    title="Alice API",
    version="0.1.0",
    description="Backend service for Alice soft-skills platform.",
)


@app.get("/health", tags=["Health"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}
