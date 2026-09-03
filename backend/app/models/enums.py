"""Canonical StrEnums shared by SQLAlchemy models and Pydantic schemas.

Each enum documents which frontend-specific string(s) it reconciles, per the
approved architecture plan (both OrbitAdmin's and the mobile prototype's mock
data used incompatible ad-hoc strings for the same underlying concept).
"""
from __future__ import annotations

from enum import StrEnum


class UserStatusEnum(StrEnum):
    ACTIVE = "ACTIVE"
    PENDING = "PENDING"
    SUSPENDED = "SUSPENDED"


class BusinessStatusEnum(StrEnum):
    ACTIVE = "ACTIVE"
    PENDING = "PENDING"
    SUSPENDED = "SUSPENDED"


class BusinessActivityEnum(StrEnum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


class BusinessMemberRoleEnum(StrEnum):
    OWNER = "OWNER"
    STAFF = "STAFF"
    VIEWER = "VIEWER"


class ProviderCategoryEnum(StrEnum):
    """Union of admin's {Digital Wallet, Banking, Payment Network} and mobile's
    {wallet, bank, payment, business, cash}."""

    WALLET = "WALLET"
    BANK = "BANK"
    PAYMENT = "PAYMENT"
    BUSINESS = "BUSINESS"
    CASH = "CASH"


class ProviderAvailabilityEnum(StrEnum):
    DEMO = "DEMO"
    PARTNER = "PARTNER"
    COMING_SOON = "COMING_SOON"
    AVAILABLE = "AVAILABLE"


class ProviderHealthStatusEnum(StrEnum):
    """Admin dashboard's provider-health badge: Healthy / Warning / Sandbox / Down."""

    HEALTHY = "HEALTHY"
    WARNING = "WARNING"
    SANDBOX = "SANDBOX"
    DOWN = "DOWN"


class ConnectionModeEnum(StrEnum):
    DEMO = "DEMO"
    LIVE = "LIVE"


class ConnectionStatusEnum(StrEnum):
    PENDING = "PENDING"
    CONNECTED = "CONNECTED"
    SYNCING = "SYNCING"
    ERROR = "ERROR"
    REVOKED = "REVOKED"


class TransactionTypeEnum(StrEnum):
    """Admin's {Sale,Refund,Payout} fold to INCOME, {Expense} folds to EXPENSE;
    mobile's income/expense map 1:1. Original label kept in `category`."""

    INCOME = "INCOME"
    EXPENSE = "EXPENSE"


class TransactionSourceEnum(StrEnum):
    PROVIDER_API = "PROVIDER_API"
    BANK_FEED = "BANK_FEED"
    MANUAL = "MANUAL"
    QR = "QR"


class TransactionStatusEnum(StrEnum):
    """Mobile's completed/pending/flagged + admin's Completed/Pending/Failed unified."""

    COMPLETED = "COMPLETED"
    PENDING = "PENDING"
    FAILED = "FAILED"
    FLAGGED = "FLAGGED"


class ConsentStatusEnum(StrEnum):
    GRANTED = "GRANTED"
    PENDING = "PENDING"
    REVOKED = "REVOKED"
    EXPIRED = "EXPIRED"


class OpportunityKindEnum(StrEnum):
    """Merges mobile's FinancingOption / InsuranceOption into one table."""

    FINANCING = "FINANCING"
    INSURANCE = "INSURANCE"


class RiskLevelEnum(StrEnum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


class RiskStatusEnum(StrEnum):
    OPEN = "OPEN"
    INVESTIGATING = "INVESTIGATING"
    RESOLVED = "RESOLVED"


class SupportPriorityEnum(StrEnum):
    URGENT = "URGENT"
    HIGH = "HIGH"
    NORMAL = "NORMAL"
    LOW = "LOW"


class SupportStatusEnum(StrEnum):
    OPEN = "OPEN"
    PENDING = "PENDING"
    RESOLVED = "RESOLVED"


class SavingsGoalStatusEnum(StrEnum):
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"
    PAUSED = "PAUSED"


class PaymentProviderEnum(StrEnum):
    ESEWA = "ESEWA"
    KHALTI = "KHALTI"


class PaymentIntentStatusEnum(StrEnum):
    PENDING = "PENDING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class AdminRoleEnum(StrEnum):
    SUPER_ADMIN = "SUPER_ADMIN"
    OPERATIONS_ADMIN = "OPERATIONS_ADMIN"
    SUPPORT_ADMIN = "SUPPORT_ADMIN"
    COMPLIANCE_ADMIN = "COMPLIANCE_ADMIN"


class AuditActionEnum(StrEnum):
    ADMIN_LOGIN = "ADMIN_LOGIN"
    OVERVIEW_VIEWED = "OVERVIEW_VIEWED"
    USER_VIEWED = "USER_VIEWED"
    BUSINESS_VIEWED = "BUSINESS_VIEWED"
    TRANSACTION_VIEWED = "TRANSACTION_VIEWED"
    PROVIDER_VIEWED = "PROVIDER_VIEWED"
    CONNECTION_VIEWED = "CONNECTION_VIEWED"
    CONSENT_VIEWED = "CONSENT_VIEWED"
    RISK_VIEWED = "RISK_VIEWED"
    AUDIT_LOG_VIEWED = "AUDIT_LOG_VIEWED"
    SUPPORT_TICKET_VIEWED = "SUPPORT_TICKET_VIEWED"
    AI_USAGE_VIEWED = "AI_USAGE_VIEWED"
