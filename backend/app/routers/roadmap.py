from fastapi import APIRouter
from typing import Any, Dict

router = APIRouter(prefix="/roadmap", tags=["roadmap"])

@router.post("")
def roadmap(request: Dict[str, Any]):
    return {
        "career": request.get("career", "Unknown"),
        "summary": "This is a stubbed roadmap. Replace with Gemini output.",
        "steps": [
            {"step": 1, "title": "Learn basics", "duration_months": 3, "details": "Do X, Y, Z"},
            {"step": 2, "title": "Build projects", "duration_months": 6, "details": "Build A, B"}
        ]
    }
