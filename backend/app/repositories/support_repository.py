from __future__ import annotations

from sqlalchemy import func, select

from app.models.enums import SupportStatusEnum
from app.models.support import SupportTicket
from app.repositories.base import BaseRepository


class SupportTicketRepository(BaseRepository[SupportTicket]):
    model = SupportTicket

    async def count_open(self) -> int:
        result = await self.db.execute(
            select(func.count()).select_from(SupportTicket).where(SupportTicket.status != SupportStatusEnum.RESOLVED)
        )
        return result.scalar_one()
