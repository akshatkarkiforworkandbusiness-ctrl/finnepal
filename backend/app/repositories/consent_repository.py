from __future__ import annotations

from sqlalchemy import select

from app.models.consent import Consent
from app.repositories.base import BaseRepository


class ConsentRepository(BaseRepository[Consent]):
    model = Consent

    async def list_for_user(self, user_id) -> list[Consent]:
        result = await self.db.execute(select(Consent).where(Consent.user_id == user_id))
        return list(result.scalars().all())
