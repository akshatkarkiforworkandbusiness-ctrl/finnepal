from __future__ import annotations

import uuid

from sqlalchemy import select

from app.models.business import Business, BusinessMember
from app.models.enums import BusinessMemberRoleEnum
from app.repositories.base import BaseRepository


class BusinessRepository(BaseRepository[Business]):
    model = Business

    async def list_for_owner(self, owner_user_id: uuid.UUID) -> list[Business]:
        result = await self.db.execute(select(Business).where(Business.owner_user_id == owner_user_id))
        return list(result.scalars().all())

    async def add_member(self, business_id: uuid.UUID, user_id: uuid.UUID, role: BusinessMemberRoleEnum) -> BusinessMember:
        member = BusinessMember(business_id=business_id, user_id=user_id, role=role)
        self.db.add(member)
        return member
