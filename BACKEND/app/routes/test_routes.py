from fastapi import APIRouter, Depends
from app.auth.auth_service import require_role

router = APIRouter()

@router.get("/teller-only")
def teller_endpoint(user=Depends(require_role("teller"))):
    return {"message": "You are a teller", "user": user}

@router.get("/auditor-only")
def auditor_endpoint(user=Depends(require_role("auditor"))):
    return {"message": "You are an auditor", "user": user}