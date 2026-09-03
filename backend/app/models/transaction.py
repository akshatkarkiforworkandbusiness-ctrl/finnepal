from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Numeric, String, Text
from sqlalchemy import Enum as SAEnum
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.enums import TransactionSourceEnum, TransactionStatusEnum, TransactionTypeEnum
from app.models.mixins import TimestampMixin, UUIDPkMixin

if TYPE_CHECKING:
    from app.models.business import Business
    from app.models.provider import Provider, ProviderConnection


def _enum(pyenum, name: str, **kw):
    return SAEnum(pyenum, name=name, native_enum=True, values_callable=lambda e: [m.value for m in e], **kw)


class Transaction(UUIDPkMixin, TimestampMixin, Base):
    """The core schema reconciliation: admin's {Sale,Refund,Payout,Expense}
    strings fold into `type` (INCOME/EXPENSE) with the original label kept in
    `category`; mobile's completed/pending/flagged + admin's
    Completed/Pending/Failed unify into one TransactionStatusEnum.
    `occurred_at` (when the transaction happened) is kept distinct from
    `created_at` (when the row was written, e.g. via sync)."""

    __tablename__ = "transactions"

    business_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False)
    provider_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("providers.id", ondelete="RESTRICT"), nullable=False)
    connection_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("provider_connections.id", ondelete="SET NULL"), nullable=True
    )
    external_reference: Mapped[str | None] = mapped_column(String(255), nullable=True, index=True)
    type: Mapped[TransactionTypeEnum] = mapped_column(_enum(TransactionTypeEnum, "transaction_type_enum"), nullable=False)
    source: Mapped[TransactionSourceEnum] = mapped_column(_enum(TransactionSourceEnum, "transaction_source_enum"), nullable=False)
    category: Mapped[str | None] = mapped_column(String(100), nullable=True)
    amount: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(10), nullable=False, default="NPR", server_default="NPR")
    status: Mapped[TransactionStatusEnum] = mapped_column(
        _enum(TransactionStatusEnum, "transaction_status_enum"),
        nullable=False,
        default=TransactionStatusEnum.COMPLETED,
        server_default=TransactionStatusEnum.COMPLETED.value,
    )
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    occurred_at: Mapped[object] = mapped_column(DateTime(timezone=True), nullable=False)
    transaction_metadata: Mapped[dict] = mapped_column("metadata", JSONB, nullable=False, default=dict, server_default="{}")

    business: Mapped["Business"] = relationship(back_populates="transactions")
    provider: Mapped["Provider"] = relationship(back_populates="transactions")
    connection: Mapped["ProviderConnection | None"] = relationship()
