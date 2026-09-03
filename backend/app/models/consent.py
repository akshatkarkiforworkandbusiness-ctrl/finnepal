from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey
from sqlalchemy import Enum as SAEnum
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.enums import ConsentStatusEnum
from app.models.mixins import TimestampMixin, UUIDPkMixin

if TYPE_CHECKING:
    from app.models.business import Business
    from app.models.provider import Provider
    from app.models.user import User


class Consent(UUIDPkMixin, TimestampMixin, Base):
    """`scope` is a JSONB array of permission strings (admin's mock data used a
    comma-joined string like "Transactions, Balance"; split on ingest). Orbit
    never requests/stores bank/wallet passwords, MPIN, OTP, or CVV — no such
    columns exist here or anywhere in the schema."""

    __tablename__ = "consents"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    business_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("businesses.id", ondelete="SET NULL"), nullable=True)
    provider_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("providers.id", ondelete="RESTRICT"), nullable=False)
    scope: Mapped[list] = mapped_column(JSONB, nullable=False, default=list, server_default="[]")
    status: Mapped[ConsentStatusEnum] = mapped_column(
        SAEnum(ConsentStatusEnum, name="consent_status_enum", native_enum=True, values_callable=lambda e: [m.value for m in e]),
        nullable=False,
        default=ConsentStatusEnum.PENDING,
        server_default=ConsentStatusEnum.PENDING.value,
    )
    granted_at: Mapped[object | None] = mapped_column(DateTime(timezone=True), nullable=True)
    expires_at: Mapped[object | None] = mapped_column(DateTime(timezone=True), nullable=True)
    revoked_at: Mapped[object | None] = mapped_column(DateTime(timezone=True), nullable=True)

    user: Mapped["User"] = relationship(back_populates="consents")
    business: Mapped["Business | None"] = relationship(back_populates="consents")
    provider: Mapped["Provider"] = relationship(back_populates="consents")
