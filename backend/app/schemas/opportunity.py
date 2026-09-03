from __future__ import annotations

import uuid

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import OpportunityKindEnum


class OpportunityRead(BaseModel):
    """Informational / discovery listing only. Orbit does not underwrite, issue,
    or approve any financing or insurance product — this endpoint surfaces
    illustrative offers for the user to pursue elsewhere."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    kind: OpportunityKindEnum
    title: str
    description: str | None
    max_amount: float | None = Field(default=None, description="Financing offers only.")
    estimated_premium: str | None = Field(default=None, description="Insurance offers only.")
    note: str | None
    is_active: bool
