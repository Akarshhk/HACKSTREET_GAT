from app.crypto.encryption import encrypt_record, decrypt_record
from app.crypto.search_index import build_search_index, build_query_mask


def encrypt_and_index(customer: dict):
    """
    Encrypts customer record and builds searchable index.
    """
    searchable_text = (
        customer.get("name", "") +
        customer.get("account_number", "")
    )

    encrypted_blob = encrypt_record(customer)
    search_index = build_search_index(searchable_text)

    return encrypted_blob, search_index


def decrypt_customer(encrypted_blob: bytes):
    return decrypt_record(encrypted_blob)


def build_search_query(query: str):
    return build_query_mask(query)