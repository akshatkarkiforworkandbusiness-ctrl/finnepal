from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.repositories.opportunity_repository import OpportunityRepository
from app.schemas.opportunity import OpportunityRead

router = APIRouter()


@router.get(
    "/opportunities",
    response_model=list[OpportunityRead],
    summary="List financing/insurance opportunities",
    description="Informational discovery listing of financing and insurance offers. Orbit does not underwrite, "
    "issue, or approve any loan or insurance product — this endpoint surfaces illustrative third-party-style "
    "offers only.",
)
async def list_opportunities(db: AsyncSession = Depends(get_db)):
    return await OpportunityRepository(db).list_active()
