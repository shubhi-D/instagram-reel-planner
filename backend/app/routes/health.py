from fastapi import APIRouter

router = APIRouter(
    prefix="",
    tags=["health"],
)

@router.get("/health", status_code=200)
async def health_check() -> dict[str, str]:
    """Health check endpoint."""
    return {"status": "ok"}
