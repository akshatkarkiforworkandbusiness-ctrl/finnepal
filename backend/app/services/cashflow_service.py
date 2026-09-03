"""Cash-flow aggregation. Every dashboard total (admin overview, business
detail) must call this — never hardcode income/expense/net numbers."""
from __future__ import annotations

import uuid
from dataclasses import dataclass

from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.transaction_repository import TransactionRepository


@dataclass
class CashFlowSummary:
    total_income: float
    total_expense: float
    net_cash_flow: float


async def compute_cash_flow(db: AsyncSession, business_id: uuid.UUID | None = None) -> CashFlowSummary:
    repo = TransactionRepository(db)
    income, expense = await repo.sum_income_expense(business_id=business_id)
    return CashFlowSummary(total_income=income, total_expense=expense, net_cash_flow=income - expense)
