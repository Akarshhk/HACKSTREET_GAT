from fastapi import APIRouter, HTTPException
from app.auth.auth_service import authenticate_user, create_access_token

router = APIRouter()

@router.post("/login")
def login(username: str, password: str):
    user = authenticate_user(username, password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(user)
    return {"access_token": token, "token_type": "bearer"}