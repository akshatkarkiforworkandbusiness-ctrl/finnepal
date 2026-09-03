"""Customer-facing AI assistant (mobile app), backed by Groq."""
from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.ai import AiChatRequest, AiChatResponse
from app.services import ai_service

router = APIRouter()


@router.post(
    "/ai/chat",
    response_model=AiChatResponse,
    summary="Chat with Orbit AI",
    description="Sends a message to the Groq-backed financial assistant. If business_id is given, the "
    "business's live cash-flow totals are included as context. Rate-limited per user; 429 when exceeded.",
)
async def ai_chat(payload: AiChatRequest, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)) -> AiChatResponse:
    reply = await ai_service.chat(db, user.id, payload.message, payload.business_id)
    return AiChatResponse(reply=reply)
