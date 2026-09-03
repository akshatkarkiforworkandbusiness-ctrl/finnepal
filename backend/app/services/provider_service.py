"""Drives provider adapters through the demo-connect/sync flow. Always tags
inserted rows `metadata.mode = "DEMO"` for demo connections."""
from __future__ import annotations

import uuid
from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.enums import ConnectionModeEnum, ConnectionStatusEnum, TransactionSourceEnum
from app.models.provider import ProviderConnection
from app.models.transaction import Transaction
from app.models.user import User
from app.repositories.business_repository import BusinessRepository
from app.repositories.provider_repository import ConnectionRepository, ProviderRepository
from app.repositories.transaction_repository import TransactionRepository
from app.services.providers.registry import get_adapter


def _get_adapter_or_400(provider_code: str):
    """A provider row existing in the catalog doesn't guarantee an adapter is
    registered for it (e.g. newly seeded providers) — surface that as a clean
    4xx instead of an unhandled 500."""
    try:
        return get_adapter(provider_code)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


async def demo_connect(db: AsyncSession, user: User, provider_code: str, business_id: uuid.UUID | None) -> ProviderConnection:
    provider = await ProviderRepository(db).get_by_code(provider_code)
    if provider is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Unknown provider: {provider_code}")

    if business_id is not None:
        business = await BusinessRepository(db).get(business_id)
        if business is None or business.owner_user_id != user.id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Business not found")

    adapter = _get_adapter_or_400(provider_code)
    status_result = await adapter.connect(user_id=user.id, mode="DEMO")

    conn = ProviderConnection(
        user_id=user.id,
        business_id=business_id,
        provider_id=provider.id,
        mode=ConnectionModeEnum.DEMO,
        status=status_result,
        permissions=["transactions", "balance"],
        connected_at=datetime.now(timezone.utc),
    )
    ConnectionRepository(db).add(conn)
    await db.commit()
    await db.refresh(conn)
    return conn


async def sync_connection(db: AsyncSession, user: User, provider_code: str) -> tuple[ProviderConnection, int]:
    provider = await ProviderRepository(db).get_by_code(provider_code)
    if provider is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Unknown provider: {provider_code}")

    conn_repo = ConnectionRepository(db)
    conn = await conn_repo.get_active_for_user_and_provider(user.id, provider.id)
    if conn is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No connection found for this provider; connect first")

    if conn.business_id is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Connection has no associated business to sync transactions into")

    adapter = _get_adapter_or_400(provider_code)
    conn.status = ConnectionStatusEnum.SYNCING
    await db.flush()

    raw_rows = await adapter.fetch_transactions(since=conn.last_synced_at)
    txn_repo = TransactionRepository(db)
    inserted = 0
    for raw in raw_rows:
        normalized = adapter.normalize_transaction(raw)
        txn = Transaction(
            business_id=conn.business_id,
            provider_id=provider.id,
            connection_id=conn.id,
            external_reference=normalized.external_reference,
            type=normalized.type,
            source=TransactionSourceEnum.PROVIDER_API,
            category=normalized.category,
            amount=normalized.amount,
            currency=normalized.currency,
            status=normalized.status,
            description=normalized.description,
            occurred_at=normalized.occurred_at,
            transaction_metadata=normalized.metadata,
        )
        txn_repo.add(txn)
        inserted += 1

    conn.status = ConnectionStatusEnum.CONNECTED
    conn.last_synced_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(conn)
    return conn, inserted
