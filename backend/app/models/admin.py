from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, ForeignKey, String
from sqlalchemy import Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.enums import AdminRoleEnum, AuditActionEnum
from app.models.mixins import CreatedAtMixin, TimestampMixin, UUIDPkMixin


class AdminUser(UUIDPkMixin, TimestampMixin, Base):
    __tablename__ = "admin_users"

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    photo_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[AdminRoleEnum] = mapped_column(
        SAEnum(AdminRoleEnum, name="admin_role_enum", native_enum=True, values_callable=lambda e: [m.value for m in e]), nullable=False
    )
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True, server_default="true")
    last_login_at: Mapped[object | None] = mapped_column(DateTime(timezone=True), nullable=True)

    refresh_tokens: Mapped[list["AdminRefreshToken"]] = relationship(back_populates="admin_user", cascade="all, delete-orphan")


class AdminRefreshToken(UUIDPkMixin, CreatedAtMixin, Base):
    """Rotating single-use refresh tokens. Only a SHA-256 hash of the token is
    ever stored, never the raw value. Reuse of an already-rotated token revokes
    the whole chain (reuse-detection)."""

    __tablename__ = "admin_refresh_tokens"

    admin_user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("admin_users.id", ondelete="CASCADE"), nullable=False)
    token_hash: Mapped[str] = mapped_column(String(64), nullable=False, unique=True, index=True)
    expires_at: Mapped[object] = mapped_column(DateTime(timezone=True), nullable=False)
    revoked_at: Mapped[object | None] = mapped_column(DateTime(timezone=True), nullable=True)
    replaced_by_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("admin_refresh_tokens.id", ondelete="SET NULL"), nullable=True
    )

    admin_user: Mapped["AdminUser"] = relationship(back_populates="refresh_tokens")


class AuditLog(UUIDPkMixin, CreatedAtMixin, Base):
    """Append-only — no update/delete routes exist for this table."""

    __tablename__ = "audit_logs"

    admin_user_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("admin_users.id", ondelete="SET NULL"), nullable=True)
    action: Mapped[AuditActionEnum] = mapped_column(
        SAEnum(AuditActionEnum, name="audit_action_enum", native_enum=True, values_callable=lambda e: [m.value for m in e]), nullable=False
    )
    target_type: Mapped[str | None] = mapped_column(String(50), nullable=True)
    target_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    description: Mapped[str | None] = mapped_column(String(500), nullable=True)
    ip_address: Mapped[str | None] = mapped_column(String(64), nullable=True)

    admin_user: Mapped["AdminUser | None"] = relationship()
