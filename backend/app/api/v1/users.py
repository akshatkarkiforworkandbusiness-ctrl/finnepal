from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.user import UserRead, UserUpdate
from app.services import user_service

router = APIRouter()


@router.get("/users/me", response_model=UserRead, summary="Get my profile", description="Returns the calling customer's own profile.")
async def get_me(user: User = Depends(get_current_user)) -> User:
    return user


@router.patch("/users/me", response_model=UserRead, summary="Update my profile", description="Partially updates the calling customer's own profile. Email and status are not editable here.")
async def patch_me(payload: UserUpdate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)) -> User:
    return await user_service.update_user(db, user, payload)
