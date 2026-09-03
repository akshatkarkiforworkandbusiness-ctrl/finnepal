from __future__ import annotations

from sqlalchemy import Boolean, Numeric, String, Text
from sqlalchemy import Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.enums import OpportunityKindEnum
from app.models.mixins import TimestampMixin, UUIDPkMixin


class Opportunity(UUIDPkMixin, TimestampMixin, Base):
    """Merges mobile's FinancingOption/InsuranceOption into one table via a
    `kind` discriminator. Informational/discovery only — Orbit never approves
    loans or insurance; see docstrings on the API schema/response."""

    __tablename__ = "opportunities"

    kind: Mapped[OpportunityKindEnum] = mapped_column(
        SAEnum(OpportunityKindEnum, name="opportunity_kind_enum", native_enum=True, values_callable=lambda e: [m.value for m in e]),
        nullable=False,
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    max_amount: Mapped[float | None] = mapped_column(Numeric(14, 2), nullable=True)
    estimated_premium: Mapped[str | None] = mapped_column(String(100), nullable=True)
    note: Mapped[str | None] = mapped_column(String(255), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True, server_default="true")
