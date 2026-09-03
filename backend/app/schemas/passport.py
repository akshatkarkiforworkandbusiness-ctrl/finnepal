from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class FinancialPassportRead(BaseModel):
    """Financial Activity Indicators — derived live from the user's own
    transaction/connection history. This is explicitly NOT a credit score and
    must never be described or labeled as one anywhere in the product."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    user_id: uuid.UUID
    income_consistency: int = Field(description="0-100: how regularly income transactions occur.")
    savings_behavior: int = Field(description="0-100: savings contributions relative to income.")
    payment_activity: str = Field(description="Low / Moderate / High, from transaction volume.")
    repayment_behavior: int = Field(description="0-100 illustrative indicator (no loan ledger modeled yet).")
    financial_record_completeness: int = Field(description="0-100: breadth of connected providers + transaction history.")
    business_activity_duration: str | None = Field(description="Human-readable member-since duration.")
    score: int = Field(description="0-100 composite Financial Activity Indicator score. Not a credit score.")
    computed_at: datetime


class PassportShareCreate(BaseModel):
    recipient_name: str
    purpose: str | None = None


class PassportShareRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    user_id: uuid.UUID
    passport_id: uuid.UUID
    recipient_name: str
    purpose: str | None
    shared_at: datetime
    revoked_at: datetime | None
