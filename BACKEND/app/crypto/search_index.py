import hmac
import hashlib
from app.config import SEARCH_INDEX_KEY

KEY = SEARCH_INDEX_KEY.encode()

if len(KEY) != 32:
    raise ValueError("SEARCH_INDEX_KEY must be exactly 32 bytes")


def normalize(text: str) -> str:
    return text.lower().strip()


def generate_trigrams(text: str):
    text = normalize(text)
    if len(text) < 3:
        return [text]
    return [text[i:i+3] for i in range(len(text) - 2)]


def hmac_trigram(trigram: str) -> bytes:
    return hmac.new(KEY, trigram.encode(), hashlib.sha256).digest()


def build_search_index(text: str, bitmask_size: int = 1024) -> int:
    """
    Returns an integer bitmask representing the searchable index.
    """
    trigrams = generate_trigrams(text)
    bitmask = 0

    for trigram in trigrams:
        digest = hmac_trigram(trigram)
        position = int.from_bytes(digest, "big") % bitmask_size
        bitmask |= 1 << position

    return bitmask


def build_query_mask(query: str, bitmask_size: int = 1024) -> int:
    return build_search_index(query, bitmask_size)