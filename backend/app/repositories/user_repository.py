from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlalchemy import select

from app.models.user import User, UserRefreshToken
from app.repositories.base import BaseRepository


class UserRepository(BaseRepository[User]):
    model = User

    async def get_by_email(self, email: str) -> User | None:
        result = await self.db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()


class UserRefreshTokenRepository(BaseRepository[UserRefreshToken]):
    model = UserRefreshToken

    async def get_by_hash(self, token_hash: str) -> UserRefreshToken | None:
        result = await self.db.execute(select(UserRefreshToken).where(UserRefreshToken.token_hash == token_hash))
        return result.scalar_one_or_none()

    async def revoke_all_for_user(self, user_id: uuid.UUID) -> None:
        result = await self.db.execute(
            select(UserRefreshToken).where(
                UserRefreshToken.user_id == user_id,
                UserRefreshToken.revoked_at.is_(None),
            )
        )
        now = datetime.now(timezone.utc)
        for token in result.scalars().all():
            token.revoked_at = now
