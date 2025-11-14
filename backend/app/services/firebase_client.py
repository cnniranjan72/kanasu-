from firebase_admin import credentials, firestore, initialize_app
from app.config import settings

def init_firebase():
    if not settings.FIREBASE_SERVICE_ACCOUNT:
        return None
    cred = credentials.Certificate(settings.FIREBASE_SERVICE_ACCOUNT)
    try:
        initialize_app(cred)
    except:
        pass
    return firestore.client()
