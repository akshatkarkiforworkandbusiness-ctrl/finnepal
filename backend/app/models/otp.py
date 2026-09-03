from __future__ import annotations

from sqlalchemy import DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import CreatedAtMixin, UUIDPkMixin


class UserOtpCode(UUIDPkMixin, CreatedAtMixin, Base):
    """One-time passcode emailed for customer register/login. Only a SHA-256
    hash of the code is stored, never the raw value — mirrors the admin
    refresh-token design in `AdminRefreshToken`. Keyed by email rather than
    user_id since a code can be issued before the user row exists yet
    (first-time registration)."""

    __tablename__ = "user_otp_codes"

    email: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    code_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    expires_at: Mapped[object] = mapped_column(DateTime(timezone=True), nullable=False)
    consumed_at: Mapped[object | None] = mapped_column(DateTime(timezone=True), nullable=True)
    attempts: Mapped[int] = mapped_column(Integer, nullable=False, default=0, server_default="0")
