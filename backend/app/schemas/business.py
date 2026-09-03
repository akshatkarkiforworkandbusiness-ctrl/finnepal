from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.enums import BusinessActivityEnum, BusinessStatusEnum


class BusinessCreate(BaseModel):
    name: str
    type: str | None = None
    location: str | None = None


class BusinessUpdate(BaseModel):
    name: str | None = None
    type: str | None = None
    location: str | None = None
    activity: BusinessActivityEnum | None = None
    status: BusinessStatusEnum | None = None


class BusinessRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    owner_user_id: uuid.UUID
    name: str
    type: str | None
    location: str | None
    activity: BusinessActivityEnum
    status: BusinessStatusEnum
    created_at: datetime
    updated_at: datetime


class BusinessAdminRead(BusinessRead):
    """Admin list view adds owner display name and live cash-flow totals."""

    owner_name: str | None = None
    total_income: float = 0
    total_expense: float = 0
    net_cash_flow: float = 0
