from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.services.chat_service import chat_service
from app.auth.deps import require_user
import google.generativeai as genai

router = APIRouter(prefix="/chat", tags=["chatbot"])

SESSIONS = {}

class ChatMessage(BaseModel):
    session_id: str | None = None
    message: str
    language: str = "en"

@router.post("")
def chat(data: ChatMessage):
    if not data.session_id:
        import uuid
        data.session_id = str(uuid.uuid4())
        SESSIONS[data.session_id] = []

    history = SESSIONS.get(data.session_id, [])

    try:
        reply = chat_service.ask(data.message, history)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini error: {e}")

    history.append({"user": data.message, "bot": reply})
    SESSIONS[data.session_id] = history[-10:]

    return {
        "session_id": data.session_id,
        "reply": reply,
        "language": data.language,
        "history_length": len(history)
    }
