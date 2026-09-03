from __future__ import annotations

from sqlalchemy import select

from app.models.passport import FinancialPassport, PassportShare
from app.repositories.base import BaseRepository


class PassportRepository(BaseRepository[FinancialPassport]):
    model = FinancialPassport

    async def get_for_user(self, user_id) -> FinancialPassport | None:
        result = await self.db.execute(select(FinancialPassport).where(FinancialPassport.user_id == user_id))
        return result.scalar_one_or_none()


class PassportShareRepository(BaseRepository[PassportShare]):
    model = PassportShare

    async def list_for_user(self, user_id) -> list[PassportShare]:
        result = await self.db.execute(select(PassportShare).where(PassportShare.user_id == user_id))
        return list(result.scalars().all())
