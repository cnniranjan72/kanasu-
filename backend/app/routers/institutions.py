from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List

from app.schemas import PredictInput
from app.services.ml import ml_service
from app.services.institution_service import search_institutes
from app.data.career_clusters import CAREER_CLUSTER_MAP

router = APIRouter(prefix="/institutions", tags=["predict + institutions"])


# helper: match title_label → cluster
def get_cluster(title_label: str) -> Optional[str]:
    for key, obj in CAREER_CLUSTER_MAP.items():
        if obj["title_label"].lower() == title_label.lower():
            return obj["cluster_label"]
    return None


class PredictInstitutionRequest(PredictInput):
    location: str


@router.post("")
def predict_and_institutions(req: PredictInstitutionRequest):
    # --- validate location ---
    if not req.location:
        raise HTTPException(400, "location is required")

    # --- exact merge logic like notebook ---
    parts = []
    if req.text:
        parts.append(req.text)
    if req.interests:
        parts.append(" ".join(req.interests))
    if req.skills:
        parts.append(" ".join(req.skills))

    merged_text = " ".join(parts).strip()

    # --- top 3 prediction ---
    try:
        top3 = ml_service.predict_top_k({"text": merged_text}, k=3)
    except Exception as e:
        raise HTTPException(500, f"ML model error: {e}")

    if not top3:
        raise HTTPException(500, "Model returned no predictions")

    # careers list for institution search
    career_titles = [p["label"] for p in top3]

    # --- search institutions ---
    try:
        inst_results = search_institutes(
            req.location,
            career_titles,
            CAREER_CLUSTER_MAP,
            max_per_career=6
        )
    except Exception as e:
        raise HTTPException(500, f"Institutions search failed: {e}")

    # --- build final output ---
    final = {
        "location_resolved": inst_results.get("location_resolved", req.location),
        "predictions": [],
        "institutes": inst_results.get("institutes", [])
    }

    for p in top3:
        final["predictions"].append({
            "label": p["label"],
            "probability": round(p["probability"], 4),
            "cluster": get_cluster(p["label"])
        })

    return final
