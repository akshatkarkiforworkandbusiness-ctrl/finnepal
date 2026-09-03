"""Password hashing (Argon2) and JWT issuance/verification.

Only admin auth is wired end-to-end today; `create_access_token`/`create_refresh_token`
are generic enough to be reused by a future customer-auth flow.
"""
from __future__ import annotations

import hashlib
import secrets
import uuid
from datetime import datetime, timedelta, timezone
from typing import Any

from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from jose import JWTError, jwt

from app.core.config import get_settings

settings = get_settings()
_hasher = PasswordHasher()


def hash_password(raw_password: str) -> str:
    return _hasher.hash(raw_password)


def verify_password(raw_password: str, password_hash: str) -> bool:
    try:
        return _hasher.verify(password_hash, raw_password)
    except VerifyMismatchError:
        return False
    except Exception:
        return False


def generate_random_password(length: int = 20) -> str:
    """Cryptographically-random password for freshly-seeded admin accounts."""
    alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*"
    return "".join(secrets.choice(alphabet) for _ in range(length))


def create_access_token(subject: str, role: str, expires_minutes: int | None = None) -> str:
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=expires_minutes if expires_minutes is not None else settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    payload: dict[str, Any] = {"sub": subject, "role": role, "type": "access", "exp": expire}
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def create_refresh_token_value() -> str:
    """A high-entropy opaque refresh-token string (not a JWT) — only its SHA-256 hash is stored."""
    return secrets.token_urlsafe(48)


def hash_token(token_value: str) -> str:
    return hashlib.sha256(token_value.encode("utf-8")).hexdigest()


def decode_access_token(token: str) -> dict[str, Any]:
    """Raises jose.JWTError on invalid/expired token."""
    return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])


def new_uuid() -> uuid.UUID:
    return uuid.uuid4()


__all__ = [
    "hash_password",
    "verify_password",
    "generate_random_password",
    "create_access_token",
    "create_refresh_token_value",
    "hash_token",
    "decode_access_token",
    "new_uuid",
    "JWTError",
]
