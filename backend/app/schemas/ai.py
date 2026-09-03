from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.common import Page


class AiChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
    business_id: uuid.UUID | None = None


class AiChatResponse(BaseModel):
    reply: str


class AiUsageLogRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    user_id: uuid.UUID
    business_id: uuid.UUID | None
    model: str
    prompt: str
    response: str
    prompt_tokens: int
    completion_tokens: int
    total_tokens: int
    created_at: datetime


class AiUsageAdminRead(AiUsageLogRead):
    user_name: str | None = None


class AiUsageStats(BaseModel):
    total_calls: int
    total_tokens: int
    rate_limit_per_minute: int


class AiUsageOverview(BaseModel):
    stats: AiUsageStats
    page: Page[AiUsageAdminRead]
