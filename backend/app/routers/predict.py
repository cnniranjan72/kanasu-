from fastapi import APIRouter, HTTPException
from app.schemas import PredictInput, PredictResponse, PredictionItem
from app.services.ml import ml_service

router = APIRouter(prefix="/predict", tags=["predict"])

# Load your big JSON map
from app.data.career_clusters import CAREER_CLUSTER_MAP


def find_cluster(title_label: str):
    for key, obj in CAREER_CLUSTER_MAP.items():
        if obj["title_label"].lower() == title_label.lower():
            return obj["cluster_label"]
    return None


@router.post("", response_model=PredictResponse)
def predict(payload: PredictInput):

    if not payload.text and not payload.interests and not payload.skills:
        raise HTTPException(
            status_code=400,
            detail="Provide at least text or interests or skills."
        )

    # exact notebook merging
    parts = []
    if payload.text:
        parts.append(payload.text)
    if payload.interests:
        parts.append(" ".join(payload.interests))
    if payload.skills:
        parts.append(" ".join(payload.skills))

    merged_text = " ".join(parts).strip()

    try:
        top3 = ml_service.predict_top_k(
            {"text": merged_text,
             "interests": payload.interests,
             "skills": payload.skills},
            k=3
        )
    except Exception as e:
        raise HTTPException(500, f"ML inference error: {e}")

    results = []
    for pred in top3:
        label = pred["label"]
        prob = pred["probability"]

        cluster = find_cluster(label)

        results.append(
            PredictionItem(
                label=label,
                probability=round(prob, 4),
                cluster=cluster
            )
        )

    return {"top_3": results}
