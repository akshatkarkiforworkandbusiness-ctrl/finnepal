from __future__ import annotations

import uuid

from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import CreatedAtMixin, UUIDPkMixin


class AiUsageLog(UUIDPkMixin, CreatedAtMixin, Base):
    """One row per AI assistant call, for the admin usage dashboard and for
    per-user rate limiting (see ai_service.check_rate_limit)."""

    __tablename__ = "ai_usage_logs"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    business_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("businesses.id", ondelete="SET NULL"), nullable=True)
    model: Mapped[str] = mapped_column(String(100), nullable=False)
    prompt: Mapped[str] = mapped_column(Text, nullable=False)
    response: Mapped[str] = mapped_column(Text, nullable=False)
    prompt_tokens: Mapped[int] = mapped_column(Integer, nullable=False, default=0, server_default="0")
    completion_tokens: Mapped[int] = mapped_column(Integer, nullable=False, default=0, server_default="0")
    total_tokens: Mapped[int] = mapped_column(Integer, nullable=False, default=0, server_default="0")
