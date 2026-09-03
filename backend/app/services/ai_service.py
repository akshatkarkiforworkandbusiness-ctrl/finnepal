"""Orbit AI assistant: Groq chat completions (OpenAI-compatible), plus the
per-user rate limit and usage logging that gate every call."""
from __future__ import annotations

import uuid
from datetime import datetime, timedelta, timezone

import httpx
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.models.ai_usage import AiUsageLog
from app.repositories.ai_usage_repository import AiUsageRepository
from app.services.cashflow_service import compute_cash_flow

settings = get_settings()

GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions"

SYSTEM_PROMPT = (
    "You are Orbit AI, a financial assistant for small businesses in Nepal. "
    "Answer concisely in simple language. If the user writes in Nepali, reply in Nepali."
)


async def check_rate_limit(db: AsyncSession, user_id: uuid.UUID) -> None:
    repo = AiUsageRepository(db)
    since = datetime.now(timezone.utc) - timedelta(minutes=1)
    recent_calls = await repo.count_since(user_id, since)
    if recent_calls >= settings.AI_RATE_LIMIT_PER_MINUTE:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Rate limit exceeded ({settings.AI_RATE_LIMIT_PER_MINUTE}/min). Try again shortly.",
        )


async def _business_context(db: AsyncSession, business_id: uuid.UUID | None) -> str | None:
    if business_id is None:
        return None
    cf = await compute_cash_flow(db, business_id)
    return (
        f"Context: this business has {cf.total_income:.2f} in sales, {cf.total_expense:.2f} in expenses, "
        f"and {cf.net_cash_flow:.2f} net cash flow."
    )


async def chat(db: AsyncSession, user_id: uuid.UUID, message: str, business_id: uuid.UUID | None) -> str:
    if not settings.GROQ_API_KEY:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="AI assistant is not configured")

    await check_rate_limit(db, user_id)

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    context = await _business_context(db, business_id)
    if context:
        messages.append({"role": "system", "content": context})
    messages.append({"role": "user", "content": message})

    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            resp = await client.post(
                GROQ_CHAT_URL,
                headers={"Authorization": f"Bearer {settings.GROQ_API_KEY}"},
                json={"model": settings.GROQ_MODEL, "messages": messages},
            )
            resp.raise_for_status()
        except httpx.HTTPError as exc:
            raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=f"AI provider error: {exc}") from exc

    data = resp.json()
    reply = data["choices"][0]["message"]["content"]
    usage = data.get("usage", {})

    repo = AiUsageRepository(db)
    repo.add(
        AiUsageLog(
            user_id=user_id,
            business_id=business_id,
            model=settings.GROQ_MODEL,
            prompt=message,
            response=reply,
            prompt_tokens=usage.get("prompt_tokens", 0),
            completion_tokens=usage.get("completion_tokens", 0),
            total_tokens=usage.get("total_tokens", 0),
        )
    )
    await db.commit()

    return reply
