# backend/app/services/institution_service.py
import json
import logging
import math
import time
from typing import List, Dict, Any, Optional
from pathlib import Path
from urllib.parse import quote_plus

import requests
from app.config import settings

logger = logging.getLogger("app.services.institution_service")
logger.setLevel(logging.INFO)

# Try Gemini SDK
try:
    import google.generativeai as genai
    SDK_AVAILABLE = True
    logger.info("Gemini SDK import OK.")
except:
    genai = None
    SDK_AVAILABLE = False
    logger.info("Gemini SDK NOT available.")


# ---------------------------------------------------------
# GEO HELPERS
# ---------------------------------------------------------
def google_maps_search_url(query: str) -> str:
    return "https://www.google.com/maps/search/" + quote_plus(query)


def google_maps_place_url(lat: float, lng: float) -> str:
    return f"https://www.google.com/maps?q={lat},{lng}"


def haversine(lat1, lon1, lat2, lon2):
    """Distance between two lat/lng in KM."""
    R = 6371
    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)
    a = (
        math.sin(d_lat / 2) ** 2 +
        math.cos(math.radians(lat1)) *
        math.cos(math.radians(lat2)) *
        math.sin(d_lon / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


# ---------------------------------------------------------
# Gemini calling helpers
# ---------------------------------------------------------
def _normalize_model_for_sdk(model: str) -> str:
    return model.split("models/")[-1] if model.startswith("models/") else model


def _call_gemini(prompt: str) -> Optional[str]:
    """Try SDK → fallback REST → return TEXT."""
    api_key = settings.GEMINI_KEY
    model = settings.CHAT_MODEL or "gemini-2.0-flash"

    if not api_key:
        logger.error("Missing GEMINI_KEY")
        return None

    # SDK Try
    if SDK_AVAILABLE:
        try:
            genai.configure(api_key=api_key)
            m = genai.GenerativeModel(_normalize_model_for_sdk(model))
            resp = m.generate_content([{"parts":[{"type":"text","text":prompt}]}])
            if hasattr(resp, "text") and resp.text:
                return resp.text
        except Exception as e:
            logger.error("SDK failed: %s", e)

    # REST fallback
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{_normalize_model_for_sdk(model)}:generateContent?key={api_key}"
        body = {
            "contents":[
                {"parts":[{"text":prompt}]}
            ]
        }
        r = requests.post(url, json=body, timeout=15)
        data = r.json()
        if "candidates" in data:
            cand = data["candidates"][0]
            if "content" in cand:
                parts = cand["content"].get("parts", [])
                out = "".join(p.get("text","") for p in parts)
                return out
        return json.dumps(data)
    except Exception as e:
        logger.error("REST Gemini failed: %s", e)
        return None


# ---------------------------------------------------------
# MAIN INSTITUTE SEARCH LOGIC
# ---------------------------------------------------------
def search_institutes(location: str, careers: List[str], title_cluster_map=None, max_per_career: int = 6):
    title_cluster_map = title_cluster_map or {}

    # Convert keys → labels
    readable_labels = []
    for c in careers:
        meta = title_cluster_map.get(c, {})
        readable_labels.append(meta.get("title_label", c.replace("_", " ").title()))

    # -----------------------------------------------------
    # BUILD PROMPT FOR STRICT JSON OUTPUT
    # -----------------------------------------------------
    prompt = f"""
You MUST respond with **valid JSON only**. NO explanation.

Task:
1. Normalize this location and return lat/lng (India focus).
2. For each given career, find nearby real institutes OR plausible ones.
3. Each institute MUST have:
   - name
   - address
   - lat
   - lng
   - distance_km
   - courses
   - description

Input:
location: "{location}"
careers: {readable_labels}

Return JSON exactly like:

{{
  "location_resolved": "Udupi, Karnataka",
  "lat": 13.3402,
  "lng": 74.7421,
  "institutes": [
    {{
      "name": "ABC Training Center",
      "address": "XYZ Road, Udupi",
      "lat": 13.3381,
      "lng": 74.7499,
      "distance_km": 2.1,
      "courses": ["Software Engineering"],
      "description": "Short info"
    }}
  ]
}}
"""
    # -----------------------------------------------------
    # CALL GEMINI
    # -----------------------------------------------------
    raw = _call_gemini(prompt)
    if raw:
        try:
            text = raw.strip()
            first = text.find("{")
            last = text.rfind("}")
            json_text = text[first:last+1] if first != -1 else text
            data = json.loads(json_text)

            # Compute distances if missing
            base_lat = data.get("lat")
            base_lng = data.get("lng")

            cleaned = []
            for ins in data.get("institutes", []):
                name = ins.get("name")
                lat = ins.get("lat")
                lng = ins.get("lng")

                # Distance
                dist = None
                if base_lat and base_lng and lat and lng:
                    try:
                        dist = round(haversine(base_lat, base_lng, lat, lng), 2)
                    except:
                        dist = None

                cleaned.append({
                    "name": name,
                    "address": ins.get("address"),
                    "lat": lat,
                    "lng": lng,
                    "distance_km": dist,
                    "maps_url": google_maps_place_url(lat, lng) if lat and lng else google_maps_search_url(name),
                    "courses": ins.get("courses") or [],
                    "description": ins.get("description") or ""
                })

            data["institutes"] = cleaned
            if "location_resolved" not in data:
                data["location_resolved"] = location
            return data

        except Exception as e:
            logger.error("Parse error: %s", e)

    # -----------------------------------------------------
    # FALLBACK (RARE)
    # -----------------------------------------------------
    institutes = []
    for label in readable_labels:
        institutes.append({
            "name": f"{label} Center - {location}",
            "address": f"Near {location}",
            "lat": None,
            "lng": None,
            "distance_km": None,
            "maps_url": google_maps_search_url(f"{label} {location}"),
            "courses": [label],
            "description": "Fallback generated"
        })

    return {
        "location_resolved": location,
        "lat": None,
        "lng": None,
        "institutes": institutes
    }
