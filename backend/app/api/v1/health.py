from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db

router = APIRouter()


@router.get(
    "/health",
    summary="Backend + database health check",
    description="Confirms the API process is up and can reach PostgreSQL. Returns 200 with db=connected on success.",
)
async def health(db: AsyncSession = Depends(get_db)) -> dict:
    await db.execute(text("SELECT 1"))
    return {"status": "ok", "db": "connected"}
