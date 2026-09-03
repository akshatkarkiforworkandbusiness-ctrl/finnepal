from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String
from sqlalchemy import Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.enums import SupportPriorityEnum, SupportStatusEnum
from app.models.mixins import TimestampMixin, UUIDPkMixin

if TYPE_CHECKING:
    from app.models.business import Business
    from app.models.user import User


class SupportTicket(UUIDPkMixin, TimestampMixin, Base):
    __tablename__ = "support_tickets"

    user_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    business_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("businesses.id", ondelete="SET NULL"), nullable=True)
    subject: Mapped[str] = mapped_column(String(500), nullable=False)
    priority: Mapped[SupportPriorityEnum] = mapped_column(
        SAEnum(SupportPriorityEnum, name="support_priority_enum", native_enum=True, values_callable=lambda e: [m.value for m in e]),
        nullable=False,
        default=SupportPriorityEnum.NORMAL,
        server_default=SupportPriorityEnum.NORMAL.value,
    )
    status: Mapped[SupportStatusEnum] = mapped_column(
        SAEnum(SupportStatusEnum, name="support_status_enum", native_enum=True, values_callable=lambda e: [m.value for m in e]),
        nullable=False,
        default=SupportStatusEnum.OPEN,
        server_default=SupportStatusEnum.OPEN.value,
    )
    assignee: Mapped[str | None] = mapped_column(String(255), nullable=True)

    user: Mapped["User | None"] = relationship(back_populates="support_tickets")
    business: Mapped["Business | None"] = relationship(back_populates="support_tickets")
