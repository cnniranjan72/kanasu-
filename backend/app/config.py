import os
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent


class Settings:
    ENV: str = os.getenv("ENV", "development")

    # ML paths
    MODEL_PATH: str = os.getenv("MODEL_PATH", str(BASE_DIR / "models" / "model.pkl"))
    PREPROCESSOR_PATH: str = os.getenv("PREPROCESSOR_PATH", str(BASE_DIR / "models" / "preprocessor.pkl"))

    # Gemini
    GEMINI_KEY: str = os.getenv("GEMINI_KEY", "")
    CHAT_MODEL: str = os.getenv("CHAT_MODEL", "gemini-2.0-flash")

    # JSON mapping
    CLUSTER_MAP_PATH: str = os.getenv("CLUSTER_MAP_PATH", str(BASE_DIR / "models" / "title_to_cluster.json"))
    CLASSES_PATH: str = os.getenv("CLASSES_PATH", str(BASE_DIR / "models" / "title_classes.npy"))

    # Firebase
    FIREBASE_SERVICE_ACCOUNT: str = os.getenv("FIREBASE_SERVICE_ACCOUNT", "")

    # Google Maps
    GOOGLE_MAPS_KEY: str = os.getenv("GOOGLE_MAPS_KEY", "")


settings = Settings()
