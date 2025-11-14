from typing import List, Optional
from pydantic import BaseModel

class PredictInput(BaseModel):
    text: str
    education: Optional[str] = None
    stream_code: Optional[str] = None
    interests: Optional[List[str]] = None
    skills: Optional[List[str]] = None
    location: Optional[str] = None
    language: Optional[str] = "en"

class PredictionItem(BaseModel):
    label: str
    label_kn: Optional[str] = None
    probability: float
    cluster: Optional[str] = None

class PredictResponse(BaseModel):
    top_3: List[PredictionItem]

class HealthResponse(BaseModel):
    status: str
