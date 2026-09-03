from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.business import BusinessCreate, BusinessRead, BusinessUpdate
from app.services import business_service

router = APIRouter()


@router.post("/businesses", response_model=BusinessRead, status_code=201, summary="Create a business", description="Creates a business owned by the calling customer and auto-creates the OWNER business_members row.")
async def create_business(payload: BusinessCreate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await business_service.create_business(db, user, payload)


@router.get("/businesses", response_model=list[BusinessRead], summary="List my businesses", description="Lists businesses owned by the calling customer.")
async def list_businesses(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await business_service.list_businesses_for_owner(db, user)


@router.get("/businesses/{business_id}", response_model=BusinessRead, summary="Get a business", description="Fetches one of the calling customer's own businesses.")
async def get_business(business_id: uuid.UUID, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await business_service.get_owned_business_or_404(db, user, business_id)


@router.patch("/businesses/{business_id}", response_model=BusinessRead, summary="Update a business", description="Partially updates one of the calling customer's own businesses.")
async def patch_business(business_id: uuid.UUID, payload: BusinessUpdate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    business = await business_service.get_owned_business_or_404(db, user, business_id)
    return await business_service.update_business(db, business, payload)
