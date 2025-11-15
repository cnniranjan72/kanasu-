from fastapi import APIRouter, HTTPException
from app.schemas import PredictInput, PredictResponse, PredictionItem
from app.services.ml import ml_service
from typing import List

router = APIRouter(prefix="/predict", tags=["predict"])

@router.post("", response_model=PredictResponse)
def predict(payload: PredictInput):
    if not payload.text and not payload.interests:
        raise HTTPException(status_code=400, detail="Provide text or interests for prediction.")

    model_payload = {
        "text": payload.text or (" ".join(payload.interests) if payload.interests else ""),
        "education": payload.education or "",
        "stream_code": payload.stream_code or "",
        "gender": payload.gender or "",
        "age": payload.age or 0
    }

    try:
        top = ml_service.predict_top_k(model_payload, k=3)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model inference error: {e}")

    results: List[PredictionItem] = []
    for r in top:
        results.append(PredictionItem(
            label=str(r.get("label")),
            label_kn=r.get("label_kn"),
            probability=round(r.get("probability", 0.0), 4),
            cluster=r.get("cluster")
        ))
    
    return {"top_3": results}
