"""Signed Cloudinary upload endpoints. Returns a signature the client uses to
upload directly to Cloudinary — the file itself never passes through this
backend. Separate customer/admin routes so each can only ever write into
their own folder."""
from __future__ import annotations

import re

from fastapi import APIRouter, Depends, Query

from app.core.deps import get_current_admin, get_current_user
from app.models.admin import AdminUser
from app.models.user import User
from app.schemas.upload import UploadSignature
from app.services import upload_service

router = APIRouter()

_SAFE_PURPOSE = re.compile(r"^[a-z0-9_-]{1,40}$")


def _safe_purpose(purpose: str) -> str:
    return purpose if _SAFE_PURPOSE.match(purpose) else "misc"


@router.post(
    "/uploads/signature",
    response_model=UploadSignature,
    summary="Get a signed upload slot (customer)",
    description="Returns a Cloudinary signature scoped to this user's own folder. Upload the file directly to "
    "`upload_url` with this signature; the API secret never leaves the server.",
)
async def customer_upload_signature(
    purpose: str = Query("avatar", description="Short label, e.g. 'avatar' — becomes part of the storage folder."),
    user: User = Depends(get_current_user),
) -> UploadSignature:
    folder = f"orbit/customers/{user.id}/{_safe_purpose(purpose)}"
    return UploadSignature(**upload_service.create_signature(folder))


@router.post(
    "/admin/uploads/signature",
    response_model=UploadSignature,
    summary="Get a signed upload slot (admin)",
    description="Returns a Cloudinary signature scoped to this admin's own folder. Upload the file directly to "
    "`upload_url` with this signature; the API secret never leaves the server.",
)
async def admin_upload_signature(
    purpose: str = Query("avatar", description="Short label, e.g. 'avatar' — becomes part of the storage folder."),
    admin: AdminUser = Depends(get_current_admin),
) -> UploadSignature:
    folder = f"orbit/admins/{admin.id}/{_safe_purpose(purpose)}"
    return UploadSignature(**upload_service.create_signature(folder))
