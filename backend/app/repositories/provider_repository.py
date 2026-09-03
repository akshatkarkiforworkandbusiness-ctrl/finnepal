from __future__ import annotations

from sqlalchemy import select

from app.models.provider import Provider, ProviderConnection
from app.repositories.base import BaseRepository


class ProviderRepository(BaseRepository[Provider]):
    model = Provider

    async def get_by_code(self, code: str) -> Provider | None:
        result = await self.db.execute(select(Provider).where(Provider.code == code))
        return result.scalar_one_or_none()

    async def list_all(self) -> list[Provider]:
        result = await self.db.execute(select(Provider).order_by(Provider.name))
        return list(result.scalars().all())


class ConnectionRepository(BaseRepository[ProviderConnection]):
    model = ProviderConnection

    async def list_for_user(self, user_id) -> list[ProviderConnection]:
        result = await self.db.execute(select(ProviderConnection).where(ProviderConnection.user_id == user_id))
        return list(result.scalars().all())

    async def get_active_for_user_and_provider(self, user_id, provider_id) -> ProviderConnection | None:
        result = await self.db.execute(
            select(ProviderConnection).where(
                ProviderConnection.user_id == user_id,
                ProviderConnection.provider_id == provider_id,
            )
        )
        return result.scalars().first()
