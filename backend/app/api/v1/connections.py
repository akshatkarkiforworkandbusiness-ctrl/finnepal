from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.provider import ConnectionCreate, ConnectionRead
from app.services import connection_service

router = APIRouter()


@router.post("/connections", response_model=ConnectionRead, status_code=201, summary="Create a connection", description="Creates a PENDING provider connection for the calling customer (DEMO mode).")
async def create_connection(payload: ConnectionCreate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await connection_service.create_connection(db, user, payload)


@router.get("/connections", response_model=list[ConnectionRead], summary="List my connections", description="Lists all provider connections belonging to the calling customer.")
async def list_connections(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await connection_service.list_connections(db, user)


@router.get("/connections/{connection_id}", response_model=ConnectionRead, summary="Get a connection", description="Fetches one of the calling customer's own provider connections.")
async def get_connection(connection_id: uuid.UUID, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await connection_service.get_owned_connection_or_404(db, user, connection_id)


@router.delete("/connections/{connection_id}", response_model=ConnectionRead, summary="Revoke a connection", description="Revokes (soft-deletes) one of the calling customer's own provider connections; sets status=REVOKED.")
async def delete_connection(connection_id: uuid.UUID, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    conn = await connection_service.get_owned_connection_or_404(db, user, connection_id)
    await connection_service.revoke_connection(db, conn)
    return conn
