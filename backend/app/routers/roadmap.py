from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.services.chat_service import safe_generate_text

router = APIRouter(prefix="/roadmap", tags=["roadmap"])


class RoadmapPayload(BaseModel):
    career: str
    education: Optional[str] = None
    interests: Optional[List[str]] = None
    skills: Optional[List[str]] = None


@router.post("")
def generate_roadmap(payload: RoadmapPayload):
    if not payload.career:
        raise HTTPException(400, "career is required")

    prompt = build_prompt(payload)
    text = safe_generate_text(prompt)

    # Extract clean bullet points (normal text only)
    roadmap_lines = parse_bullet_points(text)

    return {
        "career": payload.career,
        "roadmap": roadmap_lines
    }


def build_prompt(payload: RoadmapPayload) -> str:
    edu = payload.education or "Not provided"
    interests = ", ".join(payload.interests or [])
    skills = ", ".join(payload.skills or [])

    return f"""
You are an expert career counselor.  
Generate a simple, beginner-friendly ROADMAP for:

Career: {payload.career}
Education: {edu}
Interests: {interests}
Skills: {skills}

⚠️ VERY IMPORTANT — OUTPUT RULES:
• OUTPUT ONLY a list of bullet points (one per line).
• DO NOT return JSON.
• DO NOT return numbers like "1." or "2.".
• DO NOT return sections, titles, headers or paragraphs.
• ONLY return lines like:
  - Learn basics of X
  - Practice Y
  - Build Z

Produce 10–14 bullet points.  
"""


def parse_bullet_points(text: str) -> List[str]:
    lines = []

    for raw in text.split("\n"):
        s = raw.strip()
        if not s:
            continue

        # Remove leading bullet characters & numbers
        s = s.lstrip("-*•●0123456789. ").strip()

        if len(s) > 2:
            lines.append(s)

    # prevent excessive length
    return lines[:20]
