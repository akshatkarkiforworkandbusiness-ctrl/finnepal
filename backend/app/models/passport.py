from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.mixins import CreatedAtMixin, TimestampMixin, UUIDPkMixin

if TYPE_CHECKING:
    from app.models.user import User


class FinancialPassport(UUIDPkMixin, TimestampMixin, Base):
    """Cache row for the Financial Activity Indicators (NEVER called a "credit
    score"). Always recomputed live from transactions on GET /passport by
    passport_service.recompute_and_store() — this row is a cache, never
    hand-edited, never the source of truth."""

    __tablename__ = "financial_passports"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    income_consistency: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    savings_behavior: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    payment_activity: Mapped[str] = mapped_column(String(20), nullable=False, default="Low")
    repayment_behavior: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    financial_record_completeness: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    business_activity_duration: Mapped[str | None] = mapped_column(String(100), nullable=True)
    score: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    computed_at: Mapped[object] = mapped_column(DateTime(timezone=True), nullable=False)

    user: Mapped["User"] = relationship(back_populates="passport")
    shares: Mapped[list["PassportShare"]] = relationship(back_populates="passport", cascade="all, delete-orphan")


class PassportShare(UUIDPkMixin, CreatedAtMixin, Base):
    """Support table for POST/DELETE /passport/share[/{id}]."""

    __tablename__ = "passport_shares"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    passport_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("financial_passports.id", ondelete="CASCADE"), nullable=False)
    recipient_name: Mapped[str] = mapped_column(String(255), nullable=False)
    purpose: Mapped[str | None] = mapped_column(String(255), nullable=True)
    shared_at: Mapped[object] = mapped_column(DateTime(timezone=True), nullable=False)
    revoked_at: Mapped[object | None] = mapped_column(DateTime(timezone=True), nullable=True)

    user: Mapped["User"] = relationship(back_populates="passport_shares")
    passport: Mapped["FinancialPassport"] = relationship(back_populates="shares")
