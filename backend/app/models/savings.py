from __future__ import annotations

import uuid
from datetime import date
from typing import TYPE_CHECKING

from sqlalchemy import Date, ForeignKey, Numeric, String
from sqlalchemy import Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.enums import SavingsGoalStatusEnum
from app.models.mixins import TimestampMixin, UUIDPkMixin

if TYPE_CHECKING:
    from app.models.user import User


class SavingsGoal(UUIDPkMixin, TimestampMixin, Base):
    """`target_date` replaces the mobile app's pre-rendered `estimatedCompletion`
    string; the service layer computes the display string from it."""

    __tablename__ = "savings_goals"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    target_amount: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False)
    current_amount: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False, default=0)
    monthly_contribution: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False, default=0)
    target_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    status: Mapped[SavingsGoalStatusEnum] = mapped_column(
        SAEnum(SavingsGoalStatusEnum, name="savings_goal_status_enum", native_enum=True, values_callable=lambda e: [m.value for m in e]),
        nullable=False,
        default=SavingsGoalStatusEnum.ACTIVE,
        server_default=SavingsGoalStatusEnum.ACTIVE.value,
    )

    user: Mapped["User"] = relationship(back_populates="savings_goals")
