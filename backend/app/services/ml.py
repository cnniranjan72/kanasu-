import joblib
import numpy as np
import pandas as pd
import json
from typing import Any, Dict, List
from app.config import settings
import os

class MLService:
    def __init__(self, model_path: str = None, classes_path: str = None, cluster_map_path: str = None):
        self.model_path = model_path or settings.MODEL_PATH
        self.classes_path = classes_path or settings.CLASSES_PATH
        self.cluster_map_path = cluster_map_path or settings.CLUSTER_MAP_PATH
        self.model = None
        self.class_labels = None
        self.cluster_map = {}

    def load(self):
        # Load model (joblib) - pipeline expected
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(f"Model file not found at {self.model_path}")
        self.model = joblib.load(self.model_path)

        # Try to get classes from pipeline classifier
        try:
            self.class_labels = list(self.model.named_steps["classifier"].classes_)
        except Exception:
            # fallback: try classes_path npy
            try:
                self.class_labels = list(np.load(self.classes_path))
            except Exception:
                self.class_labels = None

        # Load mapping file (title_code -> title_label, cluster_code, cluster_label)
        try:
            with open(self.cluster_map_path, "r", encoding="utf-8") as f:
                self.cluster_map = json.load(f)
        except Exception:
            self.cluster_map = {}

    def predict_top_k(self, payload: Dict[str, Any], k: int = 3) -> List[Dict[str, Any]]:
        """
        payload keys expected (at minimum): text, education, stream_code, gender, age
        """
        if self.model is None:
            raise RuntimeError("Model not loaded. Call load() before predict.")

        # Build DataFrame with expected columns for pipeline
        df = pd.DataFrame([{
            "text": payload.get("text", ""),
            "education": payload.get("education", ""),
            "stream_code": payload.get("stream_code", ""),
            "gender": payload.get("gender", ""),
            "age": payload.get("age", 0)
        }])

        # Run pipeline
        probs = self.model.predict_proba(df)[0]

        # Determine label names (labels are classes from classifier; assume they are title_code keys)
        labels = None
        if self.class_labels is not None and len(self.class_labels) == len(probs):
            labels = self.class_labels
        else:
            # fallback to numeric indices
            labels = list(range(len(probs)))

        # pair and sort
        pairs = list(zip(labels, probs))
        pairs.sort(key=lambda x: x[1], reverse=True)
        top = pairs[:k]

        # format with mapping (title_label, cluster)
        results = []
        for lbl, prob in top:
            lbl_str = str(lbl)
            mapping = self.cluster_map.get(lbl_str, {})
            title_label = mapping.get("title_label") or lbl_str
            cluster_label = mapping.get("cluster_label")
            results.append({
                "label": title_label,           # human readable title in English
                "label_code": lbl_str,          # original title code (for frontend mapping if needed)
                "label_kn": None,               # placeholder for Kannada translation (fill later)
                "probability": float(prob),
                "cluster": cluster_label
            })
        return results

# instantiate service
ml_service = MLService()
