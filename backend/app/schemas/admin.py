from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.enums import AuditActionEnum, RiskLevelEnum, RiskStatusEnum, SupportPriorityEnum, SupportStatusEnum


class OverviewStats(BaseModel):
    """Every total here is computed live via SQL aggregation over the current
    data set (see cashflow_service) — never a hardcoded number."""

    total_users: int
    total_businesses: int
    total_providers_connected: int
    total_transactions: int
    total_income: float
    total_expense: float
    net_cash_flow: float
    open_risk_alerts: int
    open_support_tickets: int


class UserAdminRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    email: str
    phone: str | None
    status: str
    location: str | None
    created_at: datetime
    business_count: int = 0
    transaction_count: int = 0


class RiskAlertRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    business_id: uuid.UUID | None
    business_name: str | None = None
    level: RiskLevelEnum
    title: str
    description: str | None
    status: RiskStatusEnum
    detected_at: datetime
    created_at: datetime


class AuditLogRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    admin_user_id: uuid.UUID | None
    admin_name: str | None = None
    action: AuditActionEnum
    target_type: str | None
    target_id: str | None
    description: str | None
    created_at: datetime


class SupportTicketRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    user_id: uuid.UUID | None
    user_name: str | None = None
    business_id: uuid.UUID | None
    business_name: str | None = None
    subject: str
    priority: SupportPriorityEnum
    status: SupportStatusEnum
    assignee: str | None
    created_at: datetime
    updated_at: datetime
