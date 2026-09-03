from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.enums import ConsentStatusEnum


class ConsentCreate(BaseModel):
    business_id: uuid.UUID | None = None
    provider_code: str
    scope: list[str]
    expires_at: datetime | None = None


class ConsentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    user_id: uuid.UUID
    business_id: uuid.UUID | None
    provider_id: uuid.UUID
    scope: list
    status: ConsentStatusEnum
    granted_at: datetime | None
    expires_at: datetime | None
    revoked_at: datetime | None
    created_at: datetime


class ConsentAdminRead(ConsentRead):
    user_name: str | None = None
    business_name: str | None = None
    provider_name: str | None = None
