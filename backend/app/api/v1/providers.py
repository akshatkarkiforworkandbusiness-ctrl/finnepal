from __future__ import annotations

import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Body, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.repositories.provider_repository import ProviderRepository
from app.schemas.provider import ConnectionRead, ProviderRead, SyncResult
from app.services import provider_service

router = APIRouter()


@router.get("/providers", response_model=list[ProviderRead], summary="List providers", description="Lists the catalog of connectable financial data sources (wallets, banks, payment networks, cash).")
async def list_providers(db: AsyncSession = Depends(get_db)):
    return await ProviderRepository(db).list_all()


@router.post(
    "/providers/{provider}/demo/connect",
    response_model=ConnectionRead,
    status_code=201,
    summary="Connect a provider in DEMO mode",
    description="Creates a DEMO-mode connection for the given provider code, using synthetic data only — no real "
    "credentials are requested or stored, and no network calls are made to the real provider.",
)
async def demo_connect(
    provider: str,
    business_id: uuid.UUID | None = Body(default=None, embed=True),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await provider_service.demo_connect(db, user, provider, business_id)


@router.post(
    "/providers/{provider}/sync",
    response_model=SyncResult,
    summary="Sync a provider connection",
    description="Fetches and normalizes new transactions from the given provider's existing connection. In DEMO "
    "mode this generates realistic synthetic transactions locally (zero network calls) and tags every inserted "
    "row metadata.mode=DEMO.",
)
async def sync_provider(provider: str, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    conn, inserted = await provider_service.sync_connection(db, user, provider)
    return SyncResult(
        connection_id=conn.id,
        provider_code=provider,
        mode=conn.mode,
        transactions_synced=inserted,
        synced_at=conn.last_synced_at or datetime.now(timezone.utc),
    )
