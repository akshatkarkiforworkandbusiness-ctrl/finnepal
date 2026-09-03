from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import PaymentIntentStatusEnum, PaymentProviderEnum


class PaymentInitiateRequest(BaseModel):
    business_id: uuid.UUID
    amount: float = Field(gt=0, le=1_000_000)


class EsewaInitiateResponse(BaseModel):
    payment_intent_id: uuid.UUID
    form_url: str
    form_fields: dict[str, str]
    redirect_url: str = Field(description="GET this single URL (e.g. via Linking.openURL) to auto-submit the form — no WebView needed.")


class KhaltiInitiateResponse(BaseModel):
    payment_intent_id: uuid.UUID
    payment_url: str


class PaymentIntentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    provider: PaymentProviderEnum
    amount: float
    status: PaymentIntentStatusEnum
    failure_reason: str | None
    transaction_id: uuid.UUID | None
    created_at: datetime
    updated_at: datetime
