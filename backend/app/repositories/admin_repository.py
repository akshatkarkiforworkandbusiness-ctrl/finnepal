from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlalchemy import select

from app.models.admin import AdminRefreshToken, AdminUser, AuditLog
from app.repositories.base import BaseRepository


class AdminUserRepository(BaseRepository[AdminUser]):
    model = AdminUser

    async def get_by_email(self, email: str) -> AdminUser | None:
        result = await self.db.execute(select(AdminUser).where(AdminUser.email == email))
        return result.scalar_one_or_none()


class AdminRefreshTokenRepository(BaseRepository[AdminRefreshToken]):
    model = AdminRefreshToken

    async def get_by_hash(self, token_hash: str) -> AdminRefreshToken | None:
        result = await self.db.execute(select(AdminRefreshToken).where(AdminRefreshToken.token_hash == token_hash))
        return result.scalar_one_or_none()

    async def revoke_all_for_admin(self, admin_user_id: uuid.UUID) -> None:
        result = await self.db.execute(
            select(AdminRefreshToken).where(
                AdminRefreshToken.admin_user_id == admin_user_id,
                AdminRefreshToken.revoked_at.is_(None),
            )
        )
        now = datetime.now(timezone.utc)
        for token in result.scalars().all():
            token.revoked_at = now


class AuditLogRepository(BaseRepository[AuditLog]):
    model = AuditLog
