from fastapi import APIRouter
from typing import Any, Dict

router = APIRouter(prefix="/institutions", tags=["institutions"])

@router.post("")
def institutions(request: Dict[str, Any]):
    # stub: return a small list of fake institutes
    return {
        "query": request,
        "institutions": [
            {"name": "Institute A", "address": "City X", "distance_km": 2.5},
            {"name": "Institute B", "address": "City Y", "distance_km": 7.2}
        ]
    }
