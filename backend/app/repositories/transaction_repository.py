from __future__ import annotations

import uuid

from sqlalchemy import Numeric, case, func, select

from app.models.enums import TransactionTypeEnum
from app.models.transaction import Transaction
from app.repositories.base import BaseRepository


class TransactionRepository(BaseRepository[Transaction]):
    model = Transaction

    async def list_for_business(self, business_id: uuid.UUID, page: int, page_size: int):
        return await self.list_paginated(
            page,
            page_size,
            filters=[Transaction.business_id == business_id],
            order_by=Transaction.occurred_at.desc(),
        )

    async def sum_income_expense(self, business_id: uuid.UUID | None = None) -> tuple[float, float]:
        """Pure SQL aggregation — the single source of truth every cash-flow
        number in the product must go through (see services/cashflow_service.py).
        Never hardcode a total; always call this."""
        income_case = case((Transaction.type == TransactionTypeEnum.INCOME, Transaction.amount), else_=0)
        expense_case = case((Transaction.type == TransactionTypeEnum.EXPENSE, Transaction.amount), else_=0)
        stmt = select(
            func.coalesce(func.sum(income_case), 0).cast(Numeric),
            func.coalesce(func.sum(expense_case), 0).cast(Numeric),
        )
        if business_id is not None:
            stmt = stmt.where(Transaction.business_id == business_id)
        result = await self.db.execute(stmt)
        income, expense = result.one()
        return float(income), float(expense)

    async def count_all(self) -> int:
        result = await self.db.execute(select(func.count()).select_from(Transaction))
        return result.scalar_one()
