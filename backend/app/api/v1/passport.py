from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.passport import FinancialPassportRead, PassportShareCreate, PassportShareRead
from app.services import passport_service, passport_share_service

router = APIRouter()


@router.get(
    "/passport",
    response_model=FinancialPassportRead,
    summary="Get my Financial Activity Indicators",
    description="Recomputes and returns the calling customer's Financial Activity Indicators live from their own "
    "transaction and connection history. This is NOT a credit score.",
)
async def get_passport(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await passport_service.recompute_and_store(db, user)


@router.post(
    "/passport/share",
    response_model=PassportShareRead,
    status_code=201,
    summary="Share my Financial Activity Indicators",
    description="Records that the current Financial Activity Indicators snapshot was shared with a named recipient.",
)
async def share_passport(payload: PassportShareCreate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    passport = await passport_service.recompute_and_store(db, user)
    return await passport_share_service.create_share(db, user, passport, payload)


@router.delete(
    "/passport/share/{share_id}",
    response_model=PassportShareRead,
    summary="Revoke a passport share",
    description="Revokes a previously created Financial Activity Indicators share.",
)
async def revoke_passport_share(share_id: uuid.UUID, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    share = await passport_share_service.get_owned_share_or_404(db, user, share_id)
    await passport_share_service.revoke_share(db, share)
    return share
