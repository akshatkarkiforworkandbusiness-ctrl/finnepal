from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.enums import TransactionSourceEnum, TransactionStatusEnum, TransactionTypeEnum


class TransactionCreate(BaseModel):
    business_id: uuid.UUID
    provider_code: str = "cash"
    type: TransactionTypeEnum
    source: TransactionSourceEnum = TransactionSourceEnum.MANUAL
    category: str | None = None
    amount: float
    currency: str = "NPR"
    status: TransactionStatusEnum = TransactionStatusEnum.COMPLETED
    description: str | None = None
    occurred_at: datetime
    external_reference: str | None = None


class TransactionUpdate(BaseModel):
    category: str | None = None
    amount: float | None = None
    status: TransactionStatusEnum | None = None
    description: str | None = None
    occurred_at: datetime | None = None


class TransactionRead(BaseModel):
    """Normalized transaction contract shared with the adapters' output shape.
    `metadata` maps 1:1 to the ORM's `transaction_metadata` attribute (renamed
    to avoid colliding with SQLAlchemy's reserved `Base.metadata`) — this DTO
    is what every API response/adapter actually exposes as `metadata`."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    business_id: uuid.UUID
    provider_id: uuid.UUID
    external_reference: str | None
    type: TransactionTypeEnum
    source: TransactionSourceEnum
    category: str | None
    amount: float
    currency: str
    status: TransactionStatusEnum
    description: str | None
    occurred_at: datetime
    metadata: dict
    created_at: datetime


class TransactionAdminRead(TransactionRead):
    business_name: str | None = None
    provider_name: str | None = None
    provider_code: str | None = None
