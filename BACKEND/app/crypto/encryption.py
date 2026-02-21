import os
import json
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from app.config import DATA_ENCRYPTION_KEY

# Ensure key is 32 bytes
KEY = DATA_ENCRYPTION_KEY.encode()
if len(KEY) != 32:
    raise ValueError("DATA_ENCRYPTION_KEY must be exactly 32 bytes")

aesgcm = AESGCM(KEY)


def encrypt_record(data: dict) -> bytes:
    """
    Encrypts a dictionary using AES-GCM.
    Returns nonce + ciphertext.
    """
    nonce = os.urandom(12)  # 96-bit nonce (standard for GCM)
    plaintext = json.dumps(data).encode()
    ciphertext = aesgcm.encrypt(nonce, plaintext, None)
    return nonce + ciphertext


def decrypt_record(encrypted_blob: bytes) -> dict:
    """
    Decrypts data encrypted by encrypt_record.
    """
    nonce = encrypted_blob[:12]
    ciphertext = encrypted_blob[12:]
    plaintext = aesgcm.decrypt(nonce, ciphertext, None)
    return json.loads(plaintext.decode())