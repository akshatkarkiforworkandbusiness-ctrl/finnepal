from __future__ import annotations

import uuid

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.business import Business
from app.models.enums import BusinessMemberRoleEnum
from app.models.user import User
from app.repositories.business_repository import BusinessRepository
from app.schemas.business import BusinessCreate, BusinessUpdate


async def create_business(db: AsyncSession, owner: User, payload: BusinessCreate) -> Business:
    repo = BusinessRepository(db)
    business = Business(owner_user_id=owner.id, name=payload.name, type=payload.type, location=payload.location)
    repo.add(business)
    await db.flush()
    await repo.add_member(business.id, owner.id, BusinessMemberRoleEnum.OWNER)
    await db.commit()
    await db.refresh(business)
    return business


async def list_businesses_for_owner(db: AsyncSession, owner: User) -> list[Business]:
    repo = BusinessRepository(db)
    return await repo.list_for_owner(owner.id)


async def get_owned_business_or_404(db: AsyncSession, owner: User, business_id: uuid.UUID) -> Business:
    repo = BusinessRepository(db)
    business = await repo.get(business_id)
    if business is None or business.owner_user_id != owner.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Business not found")
    return business


async def update_business(db: AsyncSession, business: Business, payload: BusinessUpdate) -> Business:
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(business, field, value)
    await db.commit()
    await db.refresh(business)
    return business
