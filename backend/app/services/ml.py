# backend/app/services/ml.py
import joblib
import numpy as np
import pandas as pd
from typing import Any, Dict, Optional
from pathlib import Path
from app.config import settings

class MLService:
    def __init__(self, model_path: str | None = None, preprocessor_path: str | None = None, classes_path: str | None = None):
        self.model_path = Path(model_path or settings.MODEL_PATH)
        self.preprocessor_path = Path(preprocessor_path or settings.PREPROCESSOR_PATH)
        # classes_path may be provided explicitly or from settings
        self.classes_path = Path(classes_path or getattr(settings, "CLASSES_PATH", self.model_path.parent / "title_classes.npy"))
        self.model: Optional[Any] = None
        self.preprocessor: Optional[Any] = None
        self.class_labels: Optional[list] = None

    def load(self):
        """
        Load the pipeline with joblib (compatible with joblib.dump).
        Also attempt to load a separate preprocessor and/or classes npy file if present.
        """
        # Model
        try:
            print("\n==============================")
            print("MODEL PATH USED:", str(self.model_path))
            print("==============================\n")
            # joblib handles large sklearn objects reliably
            self.model = joblib.load(self.model_path)
        except Exception as e:
            self.model = None
            raise RuntimeError(f"Failed to load model: {e}")

        # Preprocessor (optional)
        try:
            if self.preprocessor_path.exists():
                self.preprocessor = joblib.load(self.preprocessor_path)
        except Exception:
            self.preprocessor = None

        # class labels: prefer model.classes_ (pipeline trained with LabelEncoder may not expose directly)
        try:
            if hasattr(self.model, "classes_"):
                # e.g., when model is LabelEncoder or classifier exposing classes_
                self.class_labels = list(self.model.classes_)
        except Exception:
            self.class_labels = None

        # If still no class_labels, try loading numpy classes file (title_classes.npy)
        if not self.class_labels:
            try:
                if self.classes_path.exists():
                    arr = np.load(self.classes_path, allow_pickle=True)
                    self.class_labels = list(arr.tolist())
            except Exception:
                self.class_labels = None

    def _text_for_payload(self, payload: Dict[str, Any]) -> str:
        """
        Build the single string text used by the training pipeline.
        Training concatenated 'text' and 'interests' into one string; replicate that.
        """
        # If pipeline expects a named-column DataFrame, adjust here. For our pipeline, it's a single text input.
        text = ""
        if "text" in payload and payload["text"]:
            text = str(payload["text"])
        else:
            # combine interests/skills if provided
            parts = []
            if payload.get("interests"):
                if isinstance(payload["interests"], (list, tuple)):
                    parts.append(" ".join(map(str, payload["interests"])))
                else:
                    parts.append(str(payload["interests"]))
            if payload.get("skills"):
                if isinstance(payload["skills"], (list, tuple)):
                    parts.append(" ".join(map(str, payload["skills"])))
                else:
                    parts.append(str(payload["skills"]))
            text = " ".join([p for p in parts if p]).strip()
        return text or ""

    def predict_top_k(self, payload: Dict[str, Any], k: int = 3):
        """
        Predict top-k labels for a given payload dict.
        The pipeline expects a single text input (string). We respect that.
        Returns a list of {"label": str, "probability": float}.
        """
        if not self.model:
            raise RuntimeError("Model not loaded")

        # Build input consistent with training (single text string)
        text = self._text_for_payload(payload)

        # If still empty, best-effort: convert whole payload to string
        if not text:
            text = " ".join([f"{k}:{v}" for k, v in payload.items()])

        # Most sklearn pipelines accept an iterable of raw samples (list of strings)
        X = [text]

        # If classifier supports predict_proba, use it
        try:
            if hasattr(self.model, "predict_proba"):
                probs = self.model.predict_proba(X)[0]  # class probabilities for the single sample
                labels = self.class_labels or list(range(len(probs)))
                pairs = list(zip(labels, probs))
                pairs.sort(key=lambda x: x[1], reverse=True)
                return [
                    {"label": str(p[0]), "probability": float(p[1])}
                    for p in pairs[:k]
                ]
            else:
                pred = self.model.predict(X)[0]
                return [{"label": str(pred), "probability": 1.0}]
        except Exception as e:
            # If something goes wrong (shape mismatch), try passing raw DataFrame as fallback
            try:
                df = pd.DataFrame([payload])
                if hasattr(self.model, "predict_proba"):
                    probs = self.model.predict_proba(df)[0]
                    labels = self.class_labels or list(range(len(probs)))
                    pairs = list(zip(labels, probs))
                    pairs.sort(key=lambda x: x[1], reverse=True)
                    return [{"label": str(p[0]), "probability": float(p[1])} for p in pairs[:k]]
                else:
                    pred = self.model.predict(df)[0]
                    return [{"label": str(pred), "probability": 1.0}]
            except Exception as e2:
                raise RuntimeError(f"Prediction failed: {e} (fallback error: {e2})")

# single module-level service used by routers
ml_service = MLService()
