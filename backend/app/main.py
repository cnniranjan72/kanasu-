# backend/app/main.py
from fastapi import FastAPI
from app.routers import health, predict, roadmap, institutions, chat
from app.services.ml import ml_service
from app.utils.logging_setup import setup_logging
from app.services.firebase_client import init_firebase

setup_logging()
app = FastAPI(title="Kanasu API", version="0.1.0")

# Routers
app.include_router(health.router)
app.include_router(predict.router)
app.include_router(roadmap.router)
app.include_router(institutions.router)

# Optional chat router
try:
    from app.routers import chat
    app.include_router(chat.router)
    print("[CHAT] Chat router loaded successfully")
except Exception as e:
    print("[CHAT] Failed to load chat router:", e)


@app.on_event("startup")
def startup_event():
    # Try loading ML but DON'T crash on failure
    try:
        ml_service.load()
    except Exception as e:
        print(f"[WARNING] ML model failed to load: {e}")

    init_firebase()

@app.get("/")
def root():
    return {"msg": "Kanasu API running"}
