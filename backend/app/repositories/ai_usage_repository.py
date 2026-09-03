from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import func, select

from app.models.ai_usage import AiUsageLog
from app.repositories.base import BaseRepository


class AiUsageRepository(BaseRepository[AiUsageLog]):
    model = AiUsageLog

    async def count_since(self, user_id: uuid.UUID, since: datetime) -> int:
        result = await self.db.execute(
            select(func.count()).select_from(AiUsageLog).where(AiUsageLog.user_id == user_id, AiUsageLog.created_at >= since)
        )
        return result.scalar_one()

    async def totals(self) -> tuple[int, int]:
        """(total_calls, total_tokens) across every user."""
        result = await self.db.execute(select(func.count(), func.coalesce(func.sum(AiUsageLog.total_tokens), 0)).select_from(AiUsageLog))
        row = result.one()
        return row[0], int(row[1])
