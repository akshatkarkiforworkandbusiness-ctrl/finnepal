from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import select

from app.models.otp import UserOtpCode
from app.repositories.base import BaseRepository


class UserOtpCodeRepository(BaseRepository[UserOtpCode]):
    model = UserOtpCode

    async def get_latest_active(self, email: str) -> UserOtpCode | None:
        """Most recent unconsumed, unexpired code for this email, if any."""
        result = await self.db.execute(
            select(UserOtpCode)
            .where(
                UserOtpCode.email == email,
                UserOtpCode.consumed_at.is_(None),
                UserOtpCode.expires_at > datetime.now(timezone.utc),
            )
            .order_by(UserOtpCode.created_at.desc())
        )
        return result.scalars().first()

    async def invalidate_active(self, email: str) -> None:
        """Consumes every still-active code for this email, so only the most
        recently issued one is ever valid (resend/re-register invalidates the
        old code rather than allowing either to work)."""
        result = await self.db.execute(
            select(UserOtpCode).where(UserOtpCode.email == email, UserOtpCode.consumed_at.is_(None))
        )
        now = datetime.now(timezone.utc)
        for code in result.scalars().all():
            code.consumed_at = now
