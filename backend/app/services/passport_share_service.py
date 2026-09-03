from __future__ import annotations

import uuid
from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.passport import FinancialPassport, PassportShare
from app.models.user import User
from app.repositories.passport_repository import PassportShareRepository
from app.schemas.passport import PassportShareCreate


async def create_share(db: AsyncSession, user: User, passport: FinancialPassport, payload: PassportShareCreate) -> PassportShare:
    share = PassportShare(
        user_id=user.id,
        passport_id=passport.id,
        recipient_name=payload.recipient_name,
        purpose=payload.purpose,
        shared_at=datetime.now(timezone.utc),
    )
    PassportShareRepository(db).add(share)
    await db.commit()
    await db.refresh(share)
    return share


async def get_owned_share_or_404(db: AsyncSession, user: User, share_id: uuid.UUID) -> PassportShare:
    share = await PassportShareRepository(db).get(share_id)
    if share is None or share.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Passport share not found")
    return share


async def revoke_share(db: AsyncSession, share: PassportShare) -> None:
    share.revoked_at = datetime.now(timezone.utc)
    await db.commit()
