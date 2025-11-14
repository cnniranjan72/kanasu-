from fastapi import FastAPI
from app.routers import health, predict, roadmap, institutions
from app.services.ml import ml_service
from app.utils.logging_setup import setup_logging
from app.config import settings
from app.services.firebase_client import init_firebase

setup_logging()
app = FastAPI(title="Kanasu API", version="0.1.0")

# include routers
app.include_router(health.router)
app.include_router(predict.router)
app.include_router(roadmap.router)
app.include_router(institutions.router)

@app.on_event("startup")
def startup_event():
    # load ML model into memory
    ml_service.load()
    # init firebase (if configured)
    init_firebase()
    try:
        model_name = type(ml_service.model).__name__ if ml_service.model else "None"
        classes_sample = getattr(ml_service, "class_labels", None)
        print(f"[startup] ML model loaded: {model_name}, classes sample: {classes_sample[:5] if classes_sample else None}")
    except Exception as e:
        print(f"[startup] Error checking model: {e}")

@app.get("/")
def root():
    return {"msg": "Kanasu API running"}
