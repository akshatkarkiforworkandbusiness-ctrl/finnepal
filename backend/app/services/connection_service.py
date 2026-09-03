from __future__ import annotations

import uuid
from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.enums import ConnectionModeEnum, ConnectionStatusEnum
from app.models.provider import ProviderConnection
from app.models.user import User
from app.repositories.provider_repository import ConnectionRepository, ProviderRepository
from app.schemas.provider import ConnectionCreate


async def create_connection(db: AsyncSession, user: User, payload: ConnectionCreate) -> ProviderConnection:
    provider = await ProviderRepository(db).get_by_code(payload.provider_code)
    if provider is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Unknown provider: {payload.provider_code}")

    conn = ProviderConnection(
        user_id=user.id,
        business_id=payload.business_id,
        provider_id=provider.id,
        mode=ConnectionModeEnum.DEMO,
        status=ConnectionStatusEnum.PENDING,
        permissions=payload.permissions,
    )
    ConnectionRepository(db).add(conn)
    await db.commit()
    await db.refresh(conn)
    return conn


async def list_connections(db: AsyncSession, user: User) -> list[ProviderConnection]:
    return await ConnectionRepository(db).list_for_user(user.id)


async def get_owned_connection_or_404(db: AsyncSession, user: User, connection_id: uuid.UUID) -> ProviderConnection:
    conn = await ConnectionRepository(db).get(connection_id)
    if conn is None or conn.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Connection not found")
    return conn


async def revoke_connection(db: AsyncSession, conn: ProviderConnection) -> None:
    conn.status = ConnectionStatusEnum.REVOKED
    await db.commit()
