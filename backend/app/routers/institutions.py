from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import json
from pathlib import Path

from app.services.institution_service import search_institutes
from app.config import settings

router = APIRouter(prefix="/institutions", tags=["institutions"])

# load title->cluster map
try:
    DEFAULT_MAP_PATH = Path(settings.CLUSTER_MAP_PATH)
    with open(DEFAULT_MAP_PATH, "r", encoding="utf-8") as f:
        TITLE_CLUSTER_MAP = json.load(f)
except:
    TITLE_CLUSTER_MAP = {}

class InstitutionSearchRequest(BaseModel):
    location: str
    careers: List[str]
    max_results_per_career: Optional[int] = None

class InstituteOut(BaseModel):
    name: Optional[str]
    address: Optional[str]
    distance_km: Optional[float]
    maps_url: Optional[str]
    courses: Optional[List[str]]
    description: Optional[str]

class InstitutionSearchResponse(BaseModel):
    location_resolved: Optional[str]
    institutes: List[InstituteOut]

@router.post("/search", response_model=InstitutionSearchResponse)
def institutions_search(req: InstitutionSearchRequest):
    if not req.location:
        raise HTTPException(400, "location is required")
    if not req.careers:
        raise HTTPException(400, "careers is required")

    try:
        result = search_institutes(
            req.location,
            req.careers,
            TITLE_CLUSTER_MAP,
            max_per_career=req.max_results_per_career or 6
        )
    except Exception as e:
        raise HTTPException(500, f"Institutes search failed: {e}")

    if "institutes" in result and req.max_results_per_career:
        result["institutes"] = result["institutes"][: req.max_results_per_career]

    if "institutes" not in result:
        result = {"location_resolved": req.location, "institutes": []}

    return result
