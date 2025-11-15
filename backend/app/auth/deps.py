from fastapi import Header, HTTPException
from app.services.firebase_client import verify_token


async def require_user(authorization: str = Header(...)):
    """
    Require a valid Firebase ID token.
    Expected header: Authorization: Bearer <id_token>
    """
    if not authorization.startswith("Bearer "):
        raise HTTPException(401, "Authorization header must be: Bearer <token>")
    token = authorization.split(" ")[1]
    user = verify_token(token)
    if not user:
        raise HTTPException(401, "Invalid or expired Firebase token")
    return user # contains uid, email, etc.