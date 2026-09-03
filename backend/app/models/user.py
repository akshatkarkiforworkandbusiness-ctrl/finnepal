from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Enum as SAEnum, ForeignKey
from sqlalchemy import String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.enums import UserStatusEnum
from app.models.mixins import CreatedAtMixin, TimestampMixin, UUIDPkMixin

if TYPE_CHECKING:
    from app.models.business import Business, BusinessMember
    from app.models.consent import Consent
    from app.models.passport import FinancialPassport, PassportShare
    from app.models.provider import ProviderConnection
    from app.models.savings import SavingsGoal
    from app.models.support import SupportTicket


class User(UUIDPkMixin, TimestampMixin, Base):
    """Customer identity. Unifies the mobile app's single on-device UserProfile
    with the admin console's User list. Password auth is architecture-ready
    (nullable hash) but no customer login endpoint is built yet."""

    __tablename__ = "users"

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    phone: Mapped[str | None] = mapped_column(String(50), nullable=True)
    photo_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    password_hash: Mapped[str | None] = mapped_column(String(255), nullable=True)
    status: Mapped[UserStatusEnum] = mapped_column(
        SAEnum(UserStatusEnum, name="user_status_enum", native_enum=True, values_callable=lambda e: [m.value for m in e]),
        nullable=False,
        default=UserStatusEnum.ACTIVE,
        server_default=UserStatusEnum.ACTIVE.value,
    )
    location: Mapped[str | None] = mapped_column(String(255), nullable=True)
    user_type: Mapped[str | None] = mapped_column(String(100), nullable=True)
    financial_goal: Mapped[str | None] = mapped_column(String(255), nullable=True)
    occupation: Mapped[str | None] = mapped_column(String(255), nullable=True)

    owned_businesses: Mapped[list["Business"]] = relationship(back_populates="owner", foreign_keys="Business.owner_user_id")
    memberships: Mapped[list["BusinessMember"]] = relationship(back_populates="user")
    connections: Mapped[list["ProviderConnection"]] = relationship(back_populates="user")
    consents: Mapped[list["Consent"]] = relationship(back_populates="user")
    passport: Mapped["FinancialPassport | None"] = relationship(back_populates="user", uselist=False)
    passport_shares: Mapped[list["PassportShare"]] = relationship(back_populates="user")
    savings_goals: Mapped[list["SavingsGoal"]] = relationship(back_populates="user")
    support_tickets: Mapped[list["SupportTicket"]] = relationship(back_populates="user")
    refresh_tokens: Mapped[list["UserRefreshToken"]] = relationship(back_populates="user", cascade="all, delete-orphan")


class UserRefreshToken(UUIDPkMixin, CreatedAtMixin, Base):
    """Rotating single-use refresh tokens for customer (mobile) sessions.
    Mirrors `AdminRefreshToken` exactly: only a SHA-256 hash of the token is
    stored, and reuse of an already-rotated token revokes the whole chain."""

    __tablename__ = "user_refresh_tokens"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token_hash: Mapped[str] = mapped_column(String(64), nullable=False, unique=True, index=True)
    expires_at: Mapped[object] = mapped_column(DateTime(timezone=True), nullable=False)
    revoked_at: Mapped[object | None] = mapped_column(DateTime(timezone=True), nullable=True)
    replaced_by_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("user_refresh_tokens.id", ondelete="SET NULL"), nullable=True
    )

    user: Mapped["User"] = relationship(back_populates="refresh_tokens")
