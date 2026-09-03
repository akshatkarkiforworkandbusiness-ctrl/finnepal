from __future__ import annotations

from sqlalchemy import select

from app.models.opportunity import Opportunity
from app.repositories.base import BaseRepository


class OpportunityRepository(BaseRepository[Opportunity]):
    model = Opportunity

    async def list_active(self) -> list[Opportunity]:
        result = await self.db.execute(select(Opportunity).where(Opportunity.is_active.is_(True)))
        return list(result.scalars().all())
