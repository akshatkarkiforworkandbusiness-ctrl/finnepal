from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.enums import UserStatusEnum


class UserBase(BaseModel):
    name: str
    # Plain str (not EmailStr): seeded demo accounts use the non-public
    # orbit.demo TLD, which email-validator's reserved-TLD check would reject.
    email: str
    phone: str | None = None
    photo_url: str | None = None
    location: str | None = None
    user_type: str | None = None
    financial_goal: str | None = None
    occupation: str | None = None


class UserRead(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    status: UserStatusEnum
    created_at: datetime
    updated_at: datetime


class UserUpdate(BaseModel):
    """PATCH body for /users/me — every field optional, only supplied ones change."""

    name: str | None = None
    phone: str | None = None
    photo_url: str | None = None
    location: str | None = None
    user_type: str | None = None
    financial_goal: str | None = None
    occupation: str | None = None
