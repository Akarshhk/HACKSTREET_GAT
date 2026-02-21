import psycopg2
from app.config import DATABASE_URL


# -----------------------------
# Connection
# -----------------------------
def get_connection():
    return psycopg2.connect(DATABASE_URL)


# -----------------------------
# CRUD Operations
# -----------------------------
def insert_customer(customer_id: str, encrypted_blob: bytes, search_index: int):
    conn = get_connection()
    cur = conn.cursor()

    bitmask = format(search_index, '01024b')

    cur.execute("""
        INSERT INTO customer_records (id, encrypted_data, search_index)
        VALUES (%s, %s, %s::bit(1024))
    """, (customer_id, encrypted_blob, bitmask))

    conn.commit()
    cur.close()
    conn.close()


def update_customer(customer_id: str, encrypted_blob: bytes, search_index: int):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        UPDATE customer_records
        SET encrypted_data = %s,
            search_index = %s
        WHERE id = %s
    """, (encrypted_blob, search_index, customer_id))

    conn.commit()
    cur.close()
    conn.close()


def delete_customer(customer_id: str):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        DELETE FROM customer_records
        WHERE id = %s
    """, (customer_id,))

    conn.commit()
    cur.close()
    conn.close()


def get_customer_by_id(customer_id: str):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT id, encrypted_data, search_index, created_at
        FROM customer_records
        WHERE id = %s
    """, (customer_id,))

    result = cur.fetchone()

    cur.close()
    conn.close()

    return result


# -----------------------------
# Secure Search (CRITICAL FIX)
# -----------------------------
def fetch_candidates_by_search_mask(mask: int):
    conn = get_connection()
    cur = conn.cursor()

    # Convert int mask to 1024-bit binary string
    bitmask = format(mask, '01024b')

    cur.execute("""
        SELECT id, encrypted_data, search_index, created_at
        FROM customer_records
        WHERE (search_index & %s::bit(1024)) = %s::bit(1024)
    """, (bitmask, bitmask))

    results = cur.fetchall()

    cur.close()
    conn.close()

    return results


# -----------------------------
# Optional Audit Logging
# -----------------------------
def log_action(role: str, action: str):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO audit_logs (role, action)
        VALUES (%s, %s)
    """, (role, action))

    conn.commit()
    cur.close()
    conn.close()