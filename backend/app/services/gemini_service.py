# backend/app/services/gemini_service.py
from app.config import settings
from app.services import institution_service  # if it already contains _call_gemini

def safe_generate_text(prompt: str, retries=2):
    # If you already have _call_gemini in institution_service, call it:
    try:
        return institution_service._call_gemini(prompt)
    except Exception:
        return None
