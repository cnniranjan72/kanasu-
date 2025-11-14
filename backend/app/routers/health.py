from fastapi import APIRouter
from app.schemas import HealthResponse

router = APIRouter(prefix="", tags=["health"])

@router.get("/health", response_model=HealthResponse)
def health():
    return {"status": "ok"}
