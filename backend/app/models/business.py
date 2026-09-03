from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import Enum as SAEnum
from sqlalchemy import ForeignKey, String, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.enums import BusinessActivityEnum, BusinessMemberRoleEnum, BusinessStatusEnum
from app.models.mixins import CreatedAtMixin, TimestampMixin, UUIDPkMixin

if TYPE_CHECKING:
    from app.models.consent import Consent
    from app.models.provider import ProviderConnection
    from app.models.risk import RiskAlert
    from app.models.support import SupportTicket
    from app.models.transaction import Transaction
    from app.models.user import User


def _enum(pyenum, name: str, **kw):
    return SAEnum(pyenum, name=name, native_enum=True, values_callable=lambda e: [m.value for m in e], **kw)


class Business(UUIDPkMixin, TimestampMixin, Base):
    """`owner_user_id` is denormalized for fast admin reads; real membership goes
    through `business_members`."""

    __tablename__ = "businesses"

    owner_user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    type: Mapped[str | None] = mapped_column(String(100), nullable=True)
    location: Mapped[str | None] = mapped_column(String(255), nullable=True)
    activity: Mapped[BusinessActivityEnum] = mapped_column(
        _enum(BusinessActivityEnum, "business_activity_enum"),
        nullable=False,
        default=BusinessActivityEnum.MEDIUM,
        server_default=BusinessActivityEnum.MEDIUM.value,
    )
    status: Mapped[BusinessStatusEnum] = mapped_column(
        _enum(BusinessStatusEnum, "business_status_enum"),
        nullable=False,
        default=BusinessStatusEnum.ACTIVE,
        server_default=BusinessStatusEnum.ACTIVE.value,
    )

    owner: Mapped["User"] = relationship(back_populates="owned_businesses", foreign_keys=[owner_user_id])
    members: Mapped[list["BusinessMember"]] = relationship(back_populates="business", cascade="all, delete-orphan")
    transactions: Mapped[list["Transaction"]] = relationship(back_populates="business")
    consents: Mapped[list["Consent"]] = relationship(back_populates="business")
    connections: Mapped[list["ProviderConnection"]] = relationship(back_populates="business")
    risk_alerts: Mapped[list["RiskAlert"]] = relationship(back_populates="business")
    support_tickets: Mapped[list["SupportTicket"]] = relationship(back_populates="business")


class BusinessMember(UUIDPkMixin, CreatedAtMixin, Base):
    """User<->Business join table (role OWNER/STAFF/VIEWER). Auto-created on
    business creation even though both frontends are single-owner today."""

    __tablename__ = "business_members"
    __table_args__ = (UniqueConstraint("business_id", "user_id", name="uq_business_member"),)

    business_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    role: Mapped[BusinessMemberRoleEnum] = mapped_column(
        _enum(BusinessMemberRoleEnum, "business_member_role_enum"),
        nullable=False,
        default=BusinessMemberRoleEnum.OWNER,
        server_default=BusinessMemberRoleEnum.OWNER.value,
    )

    business: Mapped["Business"] = relationship(back_populates="members")
    user: Mapped["User"] = relationship(back_populates="memberships")
