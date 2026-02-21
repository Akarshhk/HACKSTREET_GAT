from fastapi import APIRouter, Depends
from app.auth.auth_service import get_current_user
from app.services.crypto_service import decrypt_customer, build_search_query
from app.services.db_service import fetch_candidates_by_search_mask

from uuid import uuid4
from app.services.crypto_service import encrypt_and_index
from app.services.db_service import insert_customer
from app.auth.auth_service import require_role
from fastapi import Depends

router = APIRouter()

@router.post("/search")
def search(query: str, user=Depends(get_current_user)):

    query_mask = build_search_query(query)
    records = fetch_candidates_by_search_mask(query_mask)

    if user["role"] == "teller":
        decrypted = [
            decrypt_customer(record[1])
            for record in records
        ]
        return {"results": decrypted}

    elif user["role"] == "auditor":
        return {
            "results": [
                {"record_id": record[0]}
                for record in records
            ]
        }

    return {"results": []}

@router.post("/seed")
def seed(role=Depends(require_role("admin"))):
    sample = {
        "name": "Rahul Verma",
        "account_number": "ACC123456",
        "account_type": "Savings",
        "branch_code": "BLR01"
    }

    encrypted, index = encrypt_and_index(sample)

    insert_customer(str(uuid4()), encrypted, index)

    return {"status": "inserted"}