from __future__ import annotations

from pydantic import BaseModel


class UploadSignature(BaseModel):
    """Everything the client needs to POST a file directly to Cloudinary."""

    timestamp: int
    folder: str
    signature: str
    api_key: str
    cloud_name: str
    upload_url: str
