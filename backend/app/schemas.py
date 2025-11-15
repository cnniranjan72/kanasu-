from pydantic import BaseModel, Field, model_validator
from typing import List, Optional

# ------------------------------------
# BASIC HEALTH RESPONSE
# ------------------------------------
class HealthResponse(BaseModel):
    status: str


# ------------------------------------
# MAIN PREDICTION OUTPUT MODELS
# ------------------------------------

class PredictionItem(BaseModel):
    label: str                 # career name
    label_kn: Optional[str] = None
    probability: float
    cluster: Optional[str] = None  # cluster_label string


class PredictResponse(BaseModel):
    top_3: List[PredictionItem]


# ------------------------------------
# INPUT MODEL
# ------------------------------------

class PredictInput(BaseModel):
    text: Optional[str] = None
    interests: Optional[List[str]] = None
    skills: Optional[List[str]] = None
    education: Optional[str] = None
    stream_code: Optional[str] = None
    gender: Optional[str] = None
    age: Optional[int] = None

    model_config = {"extra": "ignore"}

    @model_validator(mode="after")
    def validate_inputs(self):
        # EXACT NOTEBOOK RULE:
        if not self.text and not self.interests and not self.skills:
            raise ValueError(
                "Provide at least one of: text, interests, skills"
            )
        return self
