import joblib
import numpy as np
from typing import Any, Dict, Optional
from pathlib import Path
from app.config import settings


class MLService:
    def __init__(self, model_path=None, preprocessor_path=None, classes_path=None):
        self.model_path = Path(model_path or settings.MODEL_PATH)
        self.classes_path = Path(classes_path or settings.CLASSES_PATH)

        self.model = None
        self.class_labels = None

    # ---------------- LOAD MODEL ----------------
    def load(self):
        # Load sklearn pipeline
        self.model = joblib.load(self.model_path)

        # load class labels
        try:
            self.class_labels = np.load(self.classes_path, allow_pickle=True).tolist()
        except:
            self.class_labels = getattr(self.model, "classes_", None)

    # ---------------- MERGE TEXT LIKE NOTEBOOK ----------------
    def _merge_text(self, payload: Dict[str, Any]) -> str:
        parts = []

        txt = payload.get("text")
        if txt:
            parts.append(str(txt).strip())

        interests = payload.get("interests")
        if interests:
            if isinstance(interests, (list, tuple)):
                parts.append(" ".join(map(str, interests)))
            else:
                parts.append(str(interests))

        skills = payload.get("skills")
        if skills:
            if isinstance(skills, (list, tuple)):
                parts.append(" ".join(map(str, skills)))
            else:
                parts.append(str(skills))

        final = " ".join(p.strip() for p in parts if p).strip()
        return final

    # ---------------- TOP-K PREDICTION ----------------
    def predict_top_k(self, payload: Dict[str, Any], k: int = 3):
        if self.model is None:
            raise RuntimeError("Model not loaded")

        merged = self._merge_text(payload)
        if not merged:
            merged = ""

        X = [merged]

        if hasattr(self.model, "predict_proba"):
            probs = self.model.predict_proba(X)[0]
            labels = self.class_labels

            ranked = sorted(
                zip(labels, probs),
                key=lambda x: x[1],
                reverse=True
            )

            return [
                {"label": lab, "probability": float(p)}
                for (lab, p) in ranked[:k]
            ]

        # no predict_proba fallback
        pred = self.model.predict(X)[0]
        return [{"label": pred, "probability": 1.0}]


ml_service = MLService()
