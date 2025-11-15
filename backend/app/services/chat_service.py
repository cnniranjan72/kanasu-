# backend/app/services/chat_service.py
"""
Chat / Gemini helper service.

Provides:
- ChatService (for chat router)
- safe_generate_text(prompt) -> str | None (used by roadmap & other places)
"""

import logging
from typing import Optional, List, Dict, Any

from app.config import settings

logger = logging.getLogger("app.services.chat_service")
logger.setLevel(logging.INFO)

# Try SDK import
try:
    import google.generativeai as genai
    SDK_AVAILABLE = True
    logger.info("Gemini SDK import OK.")
except Exception:
    genai = None
    SDK_AVAILABLE = False
    logger.info("Gemini SDK NOT available; will use REST fallback.")


class ChatService:
    def __init__(self):
        # lazily configure if SDK present
        if SDK_AVAILABLE:
            try:
                genai.configure(api_key=settings.GEMINI_KEY)
                self.model = genai.GenerativeModel(settings.CHAT_MODEL)
            except Exception as e:
                logger.error("Gemini SDK init failed: %s", e)
                self.model = None
        else:
            self.model = None

    def ask(self, prompt: str, history: List[Dict[str, str]] = None) -> str:
        """
        For conversational flows — returns model text or raises.
        """
        if history is None:
            history = []

        # build conversation messages for SDK if available
        if SDK_AVAILABLE and self.model:
            try:
                # prepare list per SDK expected format
                messages = []
                for m in history:
                    messages.append({"role": "user", "parts": [m.get("user", "")]})
                    messages.append({"role": "model", "parts": [m.get("bot", "")]})
                messages.append({"role": "user", "parts": [prompt]})
                resp = self.model.generate_content(messages)
                return getattr(resp, "text", "") or ""
            except Exception as e:
                logger.error("SDK chat ask failed: %s", e)
                raise

        # fallback: use REST generate endpoint
        return safe_generate_text(prompt) or ""


def _normalize_model_for_sdk(model: str) -> str:
    return model.split("models/")[-1] if model.startswith("models/") else model


def safe_generate_text(prompt: str) -> Optional[str]:
    """
    Try to generate text from Gemini:
      1) SDK (if available)
      2) REST fallback to generativelanguage endpoint (needs API key)
    Returns raw text output (not parsed) or None on failure.
    """
    api_key = settings.GEMINI_KEY
    model = settings.CHAT_MODEL or "gemini-2.0-flash"

    if not api_key:
        logger.warning("GEMINI_KEY not configured; safe_generate_text returning None")
        return None

    # Try SDK
    if SDK_AVAILABLE:
        try:
            genai.configure(api_key=api_key)
            m = genai.GenerativeModel(_normalize_model_for_sdk(model))
            resp = m.generate_content([{"parts":[{"type":"text","text":prompt}]}])
            txt = getattr(resp, "text", None)
            if txt:
                return txt
        except Exception as e:
            logger.error("Gemini SDK generate failed: %s", e)

    # REST fallback
    try:
        import requests, json
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{_normalize_model_for_sdk(model)}:generateContent?key={api_key}"
        body = {
            "contents": [
                {"parts": [{"text": prompt}]}
            ]
        }
        r = requests.post(url, json=body, timeout=20)
        data = r.json()
        # If API returns candidates, combine their text parts
        if isinstance(data, dict):
            if "candidates" in data and data["candidates"]:
                cand = data["candidates"][0]
                if "content" in cand:
                    parts = cand["content"].get("parts", [])
                    out = "".join(p.get("text", "") for p in parts)
                    return out
            # some responses wrap text differently
            # try to flatten any 'text' fields
            if "output" in data:
                return json.dumps(data)
        # final fallback: return raw body as string
        return json.dumps(data)
    except Exception as e:
        logger.error("Gemini REST generate failed: %s", e)
        return None


# Export default service for chat router usage
chat_service = ChatService()
