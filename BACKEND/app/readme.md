🔐 Secure Encrypted Banking Lookup System
Overview

This project implements a secure banking customer lookup system that enables searching over encrypted data while preserving confidentiality and enforcing strict role-based access control.

The system ensures:

All customer data is encrypted at rest

The database never sees plaintext

Search works without decrypting stored data

Only authorized roles can decrypt results

Authentication and authorization are strictly enforced

🏗 Architecture
Client (Swagger / React)
        ↓
FastAPI Backend
        ↓
JWT Authentication + RBAC
        ↓
Crypto Service Layer
        ↓
Storage Layer (Fake DB for now)

Encryption and key management exist only inside backend memory.

⚙️ Environment Configuration

Create a .env file in the backend root directory:

DATA_ENCRYPTION_KEY=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
SEARCH_INDEX_KEY=bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
JWT_SECRET=supersecretjwtkeyforhackathon
Rules:

AES and HMAC keys must be exactly 32 characters

.env must never be committed to version control

Keys are loaded at startup using python-dotenv

Keys live only in backend memory

🔐 Cryptography Layer
AES-256-GCM Encryption

Implemented in:

app/crypto/encryption.py

Functions:

encrypt_record(data_dict)

decrypt_record(encrypted_blob)

Details:

32-byte AES key

12-byte random nonce per encryption

JSON-serialized plaintext

GCM provides confidentiality + integrity

Stored format: nonce + ciphertext

The database stores only encrypted binary blobs.

🔎 Blind Search Index (HMAC + Trigrams)

Implemented in:

app/crypto/search_index.py
Process:

Normalize text (lowercase, strip spaces)

Generate trigrams

HMAC each trigram using SEARCH_INDEX_KEY

Map HMAC digest to 1024-bit bitmask

Store bitmask as integer

Search matching logic:

index & query_mask == query_mask

Database never sees:

Plain names

Account numbers

Words

Letters

Only encrypted bitmasks.

🧠 Crypto Abstraction Layer

Implemented in:

app/services/crypto_service.py

Exposed interface:

encrypt_and_index(customer_dict)

decrypt_customer(encrypted_blob)

build_search_query(query_string)

This cleanly separates crypto logic from routes and storage.

🔑 Authentication (JWT)

Implemented in:

app/auth/auth_service.py
Demo Users
Username	Role
teller1	teller
auditor1	auditor
admin1	admin
JWT Details

Algorithm: HS256

Expiration: 60 minutes

Role embedded inside token

Signed using JWT_SECRET

Token payload:

{
  "username": "teller1",
  "role": "teller",
  "exp": 123456789
}
👥 Role-Based Access Control (RBAC)

Implemented using:

require_role("teller")
require_role("auditor")

Security enforcement happens before business logic execution.

Role Capabilities
Role	Can Search	Can Decrypt
teller	Yes	Yes
auditor	Yes	No
admin	No search	No decrypt
🔍 Core Endpoint: /search
POST /search
Flow:

Validate JWT

Extract role

Build secure query mask

Search encrypted records

If teller → decrypt results

If auditor → return metadata only

Example Response (Teller)
{
  "results": [
    {
      "name": "Rahul Verma",
      "account_number": "ACC123456",
      "account_type": "Savings",
      "branch_code": "BLR01"
    }
  ]
}
Example Response (Auditor)
{
  "results": [
    {
      "record_id": 0
    }
  ]
}
🧪 Temporary Storage Layer

For development and logic validation, an in-memory fake database is used:

FAKE_DB = [
  {
    encrypted_data,
    search_index
  }
]

Next step: Replace with PostgreSQL.

🔒 Security Guarantees

If an attacker steals only the database:

Encrypted blobs are unusable

Search index is HMAC-protected

No plaintext data is exposed

The database alone is cryptographically useless without backend-held keys.

⚠️ Known Limitations

This system does NOT protect against:

Malicious authorized insiders

Full backend runtime compromise

Access-pattern leakage

Timing attacks

Key exposure via environment leaks

Nation-state adversaries

These trade-offs are intentional for performance and hackathon scope.

🚀 Current Status

The backend currently supports:

AES-256 encrypted storage

Blind searchable encryption

JWT authentication

Role-based decryption enforcement

Secure layered architecture

Demo-ready MVP