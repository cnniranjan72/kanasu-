import os
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings:
    ENV: str = os.getenv("ENV", "development")
    MODEL_PATH: str = os.getenv("MODEL_PATH", str(BASE_DIR / "app" / "models" / "model.pkl"))
    CLASSES_PATH: str = os.getenv("CLASSES_PATH", str(BASE_DIR / "title_classes.npy"))
    CLUSTER_MAP_PATH: str = os.getenv("CLUSTER_MAP_PATH", str(BASE_DIR / "title_to_cluster.json"))
    PORT: int = int(os.getenv("PORT", 8000))
    # Add GEMINI_KEY / FIREBASE_SERVICE_ACCOUNT when ready
    GEMINI_KEY: str = os.getenv("GEMINI_KEY", "")
    FIREBASE_SERVICE_ACCOUNT: str = os.getenv("FIREBASE_SERVICE_ACCOUNT", "")

settings = Settings()
