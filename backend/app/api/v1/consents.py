from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.consent import ConsentCreate, ConsentRead
from app.services import consent_service

router = APIRouter()


@router.post("/consents", response_model=ConsentRead, status_code=201, summary="Grant a consent", description="Records a data-sharing consent grant for a provider. Only scope permissions are stored — never a password/OTP/MPIN.")
async def create_consent(payload: ConsentCreate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await consent_service.create_consent(db, user, payload)


@router.get("/consents", response_model=list[ConsentRead], summary="List my consents", description="Lists all consents granted by the calling customer.")
async def list_consents(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await consent_service.list_consents(db, user)


@router.get("/consents/{consent_id}", response_model=ConsentRead, summary="Get a consent", description="Fetches one of the calling customer's own consents.")
async def get_consent(consent_id: uuid.UUID, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await consent_service.get_owned_consent_or_404(db, user, consent_id)


@router.delete("/consents/{consent_id}", response_model=ConsentRead, summary="Revoke a consent", description="Revokes one of the calling customer's own consents.")
async def delete_consent(consent_id: uuid.UUID, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    consent = await consent_service.get_owned_consent_or_404(db, user, consent_id)
    await consent_service.revoke_consent(db, consent)
    return consent
