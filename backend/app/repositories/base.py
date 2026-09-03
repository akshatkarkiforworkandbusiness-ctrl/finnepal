"""Generic async repository: plain data access only, no business logic."""
from __future__ import annotations

import uuid
from typing import Any, Generic, TypeVar

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import Base

ModelT = TypeVar("ModelT", bound=Base)


class BaseRepository(Generic[ModelT]):
    model: type[ModelT]

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get(self, id_: uuid.UUID) -> ModelT | None:
        return await self.db.get(self.model, id_)

    async def list_paginated(
        self,
        page: int,
        page_size: int,
        filters: list[Any] | None = None,
        order_by: Any | None = None,
    ) -> tuple[list[ModelT], int]:
        stmt = select(self.model)
        count_stmt = select(func.count()).select_from(self.model)
        if filters:
            for f in filters:
                stmt = stmt.where(f)
                count_stmt = count_stmt.where(f)
        if order_by is not None:
            stmt = stmt.order_by(order_by)
        stmt = stmt.offset((page - 1) * page_size).limit(page_size)

        total = (await self.db.execute(count_stmt)).scalar_one()
        items = (await self.db.execute(stmt)).scalars().all()
        return list(items), total

    def add(self, obj: ModelT) -> ModelT:
        self.db.add(obj)
        return obj

    async def delete(self, obj: ModelT) -> None:
        await self.db.delete(obj)
