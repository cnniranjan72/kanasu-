import google.generativeai as genai
from app.config import settings

class ChatService:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_KEY)
        self.model = genai.GenerativeModel(settings.CHAT_MODEL)

    def ask(self, prompt: str, history: list = None):
        if history is None:
            history = []

        chat_messages = []
        for msg in history:
            chat_messages.append({"role": "user", "parts": [msg["user"]]})
            chat_messages.append({"role": "model", "parts": [msg["bot"]]})

        chat_messages.append({"role": "user", "parts": [prompt]})

        response = self.model.generate_content(chat_messages)
        return response.text.strip()

chat_service = ChatService()
