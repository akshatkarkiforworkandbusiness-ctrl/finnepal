from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Numeric, String
from sqlalchemy import Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.enums import PaymentIntentStatusEnum, PaymentProviderEnum
from app.models.mixins import TimestampMixin, UUIDPkMixin

if TYPE_CHECKING:
    from app.models.business import Business
    from app.models.transaction import Transaction
    from app.models.user import User


class PaymentIntent(UUIDPkMixin, TimestampMixin, Base):
    """One real eSewa/Khalti checkout attempt: collecting a payment from a
    customer into a merchant's business, as opposed to the generic
    provider-connection adapters (which sync existing transaction history —
    a capability eSewa/Khalti's public APIs don't actually offer). On
    verified completion, exactly one Transaction row is created and linked
    here, so a webhook retry or a duplicate callback can never double-count."""

    __tablename__ = "payment_intents"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    business_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False)
    provider: Mapped[PaymentProviderEnum] = mapped_column(
        SAEnum(PaymentProviderEnum, name="payment_provider_enum", native_enum=True, values_callable=lambda e: [m.value for m in e]),
        nullable=False,
    )
    amount: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False)
    status: Mapped[PaymentIntentStatusEnum] = mapped_column(
        SAEnum(PaymentIntentStatusEnum, name="payment_intent_status_enum", native_enum=True, values_callable=lambda e: [m.value for m in e]),
        nullable=False,
        default=PaymentIntentStatusEnum.PENDING,
        server_default=PaymentIntentStatusEnum.PENDING.value,
    )
    # eSewa's transaction_uuid or Khalti's pidx — set once initiated.
    provider_ref: Mapped[str | None] = mapped_column(String(255), nullable=True, index=True)
    failure_reason: Mapped[str | None] = mapped_column(String(500), nullable=True)
    transaction_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("transactions.id", ondelete="SET NULL"), nullable=True
    )

    user: Mapped["User"] = relationship()
    business: Mapped["Business"] = relationship()
    transaction: Mapped["Transaction | None"] = relationship()
