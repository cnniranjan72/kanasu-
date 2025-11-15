import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

CHAT_MODEL: str = os.getenv("CHAT_MODEL", "models/gemini-2.0-flash")

CLASSES_PATH: str = os.getenv(
    "CLASSES_PATH",
    str(BASE_DIR / "models" / "title_classes.npy")
)

TITLE_CLUSTER_PATH: str = os.getenv(
    "TITLE_CLUSTER_PATH",
    str(BASE_DIR / "models" / "title_to_cluster.json")
)
