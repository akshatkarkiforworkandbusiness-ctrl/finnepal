from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy import Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.enums import RiskLevelEnum, RiskStatusEnum
from app.models.mixins import TimestampMixin, UUIDPkMixin

if TYPE_CHECKING:
    from app.models.business import Business


class RiskAlert(UUIDPkMixin, TimestampMixin, Base):
    __tablename__ = "risk_alerts"

    business_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("businesses.id", ondelete="SET NULL"), nullable=True)
    level: Mapped[RiskLevelEnum] = mapped_column(
        SAEnum(RiskLevelEnum, name="risk_level_enum", native_enum=True, values_callable=lambda e: [m.value for m in e]), nullable=False
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[RiskStatusEnum] = mapped_column(
        SAEnum(RiskStatusEnum, name="risk_status_enum", native_enum=True, values_callable=lambda e: [m.value for m in e]),
        nullable=False,
        default=RiskStatusEnum.OPEN,
        server_default=RiskStatusEnum.OPEN.value,
    )
    detected_at: Mapped[object] = mapped_column(DateTime(timezone=True), nullable=False)

    business: Mapped["Business | None"] = relationship(back_populates="risk_alerts")
