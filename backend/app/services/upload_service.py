"""Cloudinary signed uploads. The API secret never leaves the server: we sign
a small parameter set here, and the client (admin web / mobile) uploads the
actual file bytes straight to Cloudinary using that signature — the backend
never proxies the file itself.

Signing algorithm per Cloudinary's docs: sort every parameter to be signed
alphabetically, join as "key=value&key=value...", append the API secret with
no separator, then SHA-1 hex digest.
"""
from __future__ import annotations

import hashlib
import time

from fastapi import HTTPException, status

from app.core.config import get_settings

settings = get_settings()


def is_configured() -> bool:
    return bool(settings.CLOUDINARY_CLOUD_NAME and settings.CLOUDINARY_API_KEY and settings.CLOUDINARY_API_SECRET)


def create_signature(folder: str) -> dict:
    """Returns everything the client needs to POST a file directly to
    Cloudinary's upload endpoint: timestamp, folder, signature, api_key,
    cloud_name. Raises 503 if Cloudinary isn't configured."""
    if not is_configured():
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="File uploads are not configured")

    timestamp = int(time.time())
    params_to_sign = {"folder": folder, "timestamp": timestamp}
    param_string = "&".join(f"{k}={v}" for k, v in sorted(params_to_sign.items()))
    signature = hashlib.sha1((param_string + settings.CLOUDINARY_API_SECRET).encode("utf-8")).hexdigest()

    return {
        "timestamp": timestamp,
        "folder": folder,
        "signature": signature,
        "api_key": settings.CLOUDINARY_API_KEY,
        "cloud_name": settings.CLOUDINARY_CLOUD_NAME,
        "upload_url": f"https://api.cloudinary.com/v1_1/{settings.CLOUDINARY_CLOUD_NAME}/auto/upload",
    }
