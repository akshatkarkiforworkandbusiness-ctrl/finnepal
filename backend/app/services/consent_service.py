from __future__ import annotations

import uuid
from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.consent import Consent
from app.models.enums import ConsentStatusEnum
from app.models.user import User
from app.repositories.consent_repository import ConsentRepository
from app.repositories.provider_repository import ProviderRepository
from app.schemas.consent import ConsentCreate


async def create_consent(db: AsyncSession, user: User, payload: ConsentCreate) -> Consent:
    provider = await ProviderRepository(db).get_by_code(payload.provider_code)
    if provider is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Unknown provider: {payload.provider_code}")

    consent = Consent(
        user_id=user.id,
        business_id=payload.business_id,
        provider_id=provider.id,
        scope=payload.scope,
        status=ConsentStatusEnum.GRANTED,
        granted_at=datetime.now(timezone.utc),
        expires_at=payload.expires_at,
    )
    ConsentRepository(db).add(consent)
    await db.commit()
    await db.refresh(consent)
    return consent


async def list_consents(db: AsyncSession, user: User) -> list[Consent]:
    return await ConsentRepository(db).list_for_user(user.id)


async def get_owned_consent_or_404(db: AsyncSession, user: User, consent_id: uuid.UUID) -> Consent:
    consent = await ConsentRepository(db).get(consent_id)
    if consent is None or consent.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Consent not found")
    return consent


async def revoke_consent(db: AsyncSession, consent: Consent) -> None:
    consent.status = ConsentStatusEnum.REVOKED
    consent.revoked_at = datetime.now(timezone.utc)
    await db.commit()
