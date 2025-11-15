from pydantic import BaseModel, Field, model_validator
from typing import List, Optional

class HealthResponse(BaseModel):
    status: str

class PredictionItem(BaseModel):
    label: str
    label_kn: Optional[str] = None
    probability: float
    cluster: Optional[str] = None

class PredictResponse(BaseModel):
    top_3: List[PredictionItem]

class PredictInput(BaseModel):
    text: Optional[str] = Field(default=None, description="Raw combined description")
    interests: Optional[List[str]] = Field(default=None, description="List of interests")
    skills: Optional[List[str]] = Field(default=None, description="List of skills")
    education: Optional[str] = None
    stream_code: Optional[str] = None
    gender: Optional[str] = None
    age: Optional[int] = None

    model_config = {"extra": "ignore"}

    @model_validator(mode="after")
    def validate_inputs(self):
        if not self.text and not self.interests:
            raise ValueError("Either 'text' or 'interests' must be provided.")
        return self
