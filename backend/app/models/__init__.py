"""SQLAlchemy models package.

Every model module is imported here so Alembic's autogenerate (and
`Base.metadata.create_all` in tests) sees the full mapped schema.
"""
from app.models.enums import (
    AdminRoleEnum,
    AuditActionEnum,
    BusinessActivityEnum,
    BusinessMemberRoleEnum,
    BusinessStatusEnum,
    ConnectionModeEnum,
    ConnectionStatusEnum,
    ConsentStatusEnum,
    OpportunityKindEnum,
    PaymentIntentStatusEnum,
    PaymentProviderEnum,
    ProviderAvailabilityEnum,
    ProviderCategoryEnum,
    ProviderHealthStatusEnum,
    RiskLevelEnum,
    RiskStatusEnum,
    SavingsGoalStatusEnum,
    SupportPriorityEnum,
    SupportStatusEnum,
    TransactionSourceEnum,
    TransactionStatusEnum,
    TransactionTypeEnum,
    UserStatusEnum,
)
from app.models.user import User, UserRefreshToken
from app.models.otp import UserOtpCode
from app.models.business import Business, BusinessMember
from app.models.provider import Provider, ProviderConnection
from app.models.transaction import Transaction
from app.models.consent import Consent
from app.models.passport import FinancialPassport, PassportShare
from app.models.savings import SavingsGoal
from app.models.opportunity import Opportunity
from app.models.risk import RiskAlert
from app.models.admin import AdminUser, AdminRefreshToken, AuditLog
from app.models.support import SupportTicket
from app.models.ai_usage import AiUsageLog
from app.models.payment import PaymentIntent

__all__ = [
    "AdminRoleEnum",
    "AuditActionEnum",
    "BusinessActivityEnum",
    "BusinessMemberRoleEnum",
    "BusinessStatusEnum",
    "ConnectionModeEnum",
    "ConnectionStatusEnum",
    "ConsentStatusEnum",
    "OpportunityKindEnum",
    "PaymentIntentStatusEnum",
    "PaymentProviderEnum",
    "ProviderAvailabilityEnum",
    "ProviderCategoryEnum",
    "ProviderHealthStatusEnum",
    "RiskLevelEnum",
    "RiskStatusEnum",
    "SavingsGoalStatusEnum",
    "SupportPriorityEnum",
    "SupportStatusEnum",
    "TransactionSourceEnum",
    "TransactionStatusEnum",
    "TransactionTypeEnum",
    "UserStatusEnum",
    "User",
    "UserRefreshToken",
    "UserOtpCode",
    "Business",
    "BusinessMember",
    "Provider",
    "ProviderConnection",
    "Transaction",
    "Consent",
    "FinancialPassport",
    "PassportShare",
    "SavingsGoal",
    "Opportunity",
    "RiskAlert",
    "AdminUser",
    "AdminRefreshToken",
    "AuditLog",
    "SupportTicket",
    "AiUsageLog",
    "PaymentIntent",
]
