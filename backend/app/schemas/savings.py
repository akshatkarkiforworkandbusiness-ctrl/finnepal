from __future__ import annotations

import uuid
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict

from app.models.enums import SavingsGoalStatusEnum


class SavingsGoalCreate(BaseModel):
    name: str
    target_amount: float
    current_amount: float = 0
    monthly_contribution: float = 0
    target_date: date | None = None


class SavingsGoalUpdate(BaseModel):
    name: str | None = None
    target_amount: float | None = None
    current_amount: float | None = None
    monthly_contribution: float | None = None
    target_date: date | None = None
    status: SavingsGoalStatusEnum | None = None


class SavingsGoalRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    user_id: uuid.UUID
    name: str
    target_amount: float
    current_amount: float
    monthly_contribution: float
    target_date: date | None
    status: SavingsGoalStatusEnum
    estimated_completion: str | None = None
    created_at: datetime
    updated_at: datetime
