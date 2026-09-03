from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.enums import (
    ConnectionModeEnum,
    ConnectionStatusEnum,
    ProviderAvailabilityEnum,
    ProviderCategoryEnum,
    ProviderHealthStatusEnum,
)


class ProviderRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    code: str
    name: str
    short_name: str | None
    category: ProviderCategoryEnum
    availability: ProviderAvailabilityEnum
    color: str | None
    description: str | None
    health_status: ProviderHealthStatusEnum | None
    uptime: float | None
    success_rate: float | None


class ConnectionCreate(BaseModel):
    provider_code: str
    business_id: uuid.UUID | None = None
    permissions: list[str] = []


class ConnectionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    user_id: uuid.UUID
    business_id: uuid.UUID | None
    provider_id: uuid.UUID
    mode: ConnectionModeEnum
    status: ConnectionStatusEnum
    permissions: list
    connected_at: datetime | None
    last_synced_at: datetime | None
    created_at: datetime


class SyncResult(BaseModel):
    """Response of POST /providers/{provider}/sync — always reports how many
    normalized rows were inserted, never a fabricated success message."""

    connection_id: uuid.UUID
    provider_code: str
    mode: ConnectionModeEnum
    transactions_synced: int
    synced_at: datetime
