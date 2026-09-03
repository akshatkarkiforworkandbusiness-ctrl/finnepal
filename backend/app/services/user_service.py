from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.schemas.user import UserUpdate


async def update_user(db: AsyncSession, user: User, payload: UserUpdate) -> User:
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(user, field, value)
    await db.commit()
    await db.refresh(user)
    return user
