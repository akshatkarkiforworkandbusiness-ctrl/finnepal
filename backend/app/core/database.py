"""Async SQLAlchemy engine/session setup."""
from __future__ import annotations

from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.core.config import get_settings

settings = get_settings()

engine = create_async_engine(settings.DATABASE_URL, pool_pre_ping=True, future=True)

AsyncSessionLocal = async_sessionmaker(bind=engine, expire_on_commit=False, class_=AsyncSession)


class Base(DeclarativeBase):
    """Shared declarative base for every ORM model."""


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency yielding a request-scoped session."""
    async with AsyncSessionLocal() as session:
        yield session
