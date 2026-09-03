from __future__ import annotations

from sqlalchemy import func, select

from app.models.enums import RiskStatusEnum
from app.models.risk import RiskAlert
from app.repositories.base import BaseRepository


class RiskRepository(BaseRepository[RiskAlert]):
    model = RiskAlert

    async def count_open(self) -> int:
        result = await self.db.execute(
            select(func.count()).select_from(RiskAlert).where(RiskAlert.status == RiskStatusEnum.OPEN)
        )
        return result.scalar_one()
