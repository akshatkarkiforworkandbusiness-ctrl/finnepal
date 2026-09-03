from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Numeric, String, Text
from sqlalchemy import Enum as SAEnum
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.enums import (
    ConnectionModeEnum,
    ConnectionStatusEnum,
    ProviderAvailabilityEnum,
    ProviderCategoryEnum,
    ProviderHealthStatusEnum,
)
from app.models.mixins import TimestampMixin, UUIDPkMixin

if TYPE_CHECKING:
    from app.models.business import Business
    from app.models.consent import Consent
    from app.models.transaction import Transaction
    from app.models.user import User


def _enum(pyenum, name: str, **kw):
    return SAEnum(pyenum, name=name, native_enum=True, values_callable=lambda e: [m.value for m in e], **kw)


class Provider(UUIDPkMixin, TimestampMixin, Base):
    """Catalog of connectable financial data sources. `code` is the stable
    lowercase slug used in URLs (e.g. `esewa`) and in seed transcriptions from
    both frontends' mock data."""

    __tablename__ = "providers"

    code: Mapped[str] = mapped_column(String(50), nullable=False, unique=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    short_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    category: Mapped[ProviderCategoryEnum] = mapped_column(_enum(ProviderCategoryEnum, "provider_category_enum"), nullable=False)
    availability: Mapped[ProviderAvailabilityEnum] = mapped_column(
        _enum(ProviderAvailabilityEnum, "provider_availability_enum"),
        nullable=False,
        default=ProviderAvailabilityEnum.DEMO,
        server_default=ProviderAvailabilityEnum.DEMO.value,
    )
    color: Mapped[str | None] = mapped_column(String(20), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    health_status: Mapped[ProviderHealthStatusEnum | None] = mapped_column(
        _enum(ProviderHealthStatusEnum, "provider_health_status_enum"), nullable=True
    )
    uptime: Mapped[float | None] = mapped_column(Numeric(5, 2), nullable=True)
    success_rate: Mapped[float | None] = mapped_column(Numeric(5, 2), nullable=True)
    last_sync_at: Mapped[object | None] = mapped_column(DateTime(timezone=True), nullable=True)

    connections: Mapped[list["ProviderConnection"]] = relationship(back_populates="provider")
    transactions: Mapped[list["Transaction"]] = relationship(back_populates="provider")
    consents: Mapped[list["Consent"]] = relationship(back_populates="provider")


class ProviderConnection(UUIDPkMixin, TimestampMixin, Base):
    """`mode` tags every connection DEMO/LIVE explicitly. `permissions` is a JSONB
    scope list. No credential columns exist anywhere on this table — structurally
    impossible to store a secret here."""

    __tablename__ = "provider_connections"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    business_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("businesses.id", ondelete="SET NULL"), nullable=True)
    provider_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("providers.id", ondelete="RESTRICT"), nullable=False)
    mode: Mapped[ConnectionModeEnum] = mapped_column(
        _enum(ConnectionModeEnum, "connection_mode_enum"),
        nullable=False,
        default=ConnectionModeEnum.DEMO,
        server_default=ConnectionModeEnum.DEMO.value,
    )
    status: Mapped[ConnectionStatusEnum] = mapped_column(
        _enum(ConnectionStatusEnum, "connection_status_enum"),
        nullable=False,
        default=ConnectionStatusEnum.PENDING,
        server_default=ConnectionStatusEnum.PENDING.value,
    )
    permissions: Mapped[list] = mapped_column(JSONB, nullable=False, default=list, server_default="[]")
    connected_at: Mapped[object | None] = mapped_column(DateTime(timezone=True), nullable=True)
    last_synced_at: Mapped[object | None] = mapped_column(DateTime(timezone=True), nullable=True)

    user: Mapped["User"] = relationship(back_populates="connections")
    business: Mapped["Business | None"] = relationship(back_populates="connections")
    provider: Mapped["Provider"] = relationship(back_populates="connections")
