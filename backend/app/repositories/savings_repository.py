from __future__ import annotations

from sqlalchemy import select

from app.models.savings import SavingsGoal
from app.repositories.base import BaseRepository


class SavingsRepository(BaseRepository[SavingsGoal]):
    model = SavingsGoal

    async def list_for_user(self, user_id) -> list[SavingsGoal]:
        result = await self.db.execute(select(SavingsGoal).where(SavingsGoal.user_id == user_id))
        return list(result.scalars().all())
