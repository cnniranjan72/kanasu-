import logging
from typing import Optional, Dict, Any # Added missing imports for type hints

# Assuming 'settings' is defined elsewhere and has FIREBASE_SERVICE_ACCOUNT
# For this code snippet to run, you'd need to define it or import it.
# For demonstration, we assume it exists:
class Settings:
    FIREBASE_SERVICE_ACCOUNT = None # Placeholder

settings = Settings()

logger = logging.getLogger("app.services.firebase_client")


# Import lazily so project can run if firebase is not configured
try:
    import firebase_admin
    from firebase_admin import auth as fb_auth, credentials
    FIREBASE_AVAILABLE = True
except Exception as e:
    firebase_admin = None
    fb_auth = None
    credentials = None
    FIREBASE_AVAILABLE = False
    logger.info("firebase_admin not available: %s", e)


def init_firebase() -> Optional[bool]:
    """Initialize firebase admin SDK if service account path is present."""
    if not settings.FIREBASE_SERVICE_ACCOUNT:
        logger.info("No FIREBASE_SERVICE_ACCOUNT configured; skipping firebase initialization.")
        return None

    if not FIREBASE_AVAILABLE:
        logger.error("firebase_admin package not installed. Install firebase-admin to enable firebase features.")
        return None

    try:
        # If already initialized, skip
        if not firebase_admin._apps:
            cred = credentials.Certificate(settings.FIREBASE_SERVICE_ACCOUNT)
            firebase_admin.initialize_app(cred)
            logger.info("Firebase initialized from %s", settings.FIREBASE_SERVICE_ACCOUNT)
        else:
            logger.info("Firebase already initialized")
        return True
    except Exception as e:
        logger.exception("Failed to initialize firebase: %s", e)
        return None


def verify_token(id_token: str) -> Optional[Dict[str, Any]]:
    """
    Verify Firebase ID token and return decoded claims (uid, email, etc.) or None on failure.
    Keep this function simple and resilient.
    """
    if not FIREBASE_AVAILABLE:
        logger.warning("verify_token called but firebase_admin not installed")
        return None

    try:
        decoded = fb_auth.verify_id_token(id_token)
        # decoded contains uid and other claims
        user = {
            "uid": decoded.get("uid"),
            "email": decoded.get("email"),
            "name": decoded.get("name"),
            "claims": decoded
        }
        return user
    except Exception as e:
        logger.exception("Failed to verify firebase token: %s", e)
        return None