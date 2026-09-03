"""Financial Activity Indicators computation — ports the mobile app's
`computePassport` (src/utils/finance.ts) onto live server-side data. This is
explicitly NOT a credit score; see docstrings throughout this module and the
Pydantic schema.

`recompute_and_store()` is the only writer of `financial_passports` rows — the
table is a cache, recomputed live on every GET /passport, never hand-edited.
"""
from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.business import Business
from app.models.enums import ConnectionStatusEnum, TransactionTypeEnum
from app.models.passport import FinancialPassport
from app.models.provider import ProviderConnection
from app.models.savings import SavingsGoal
from app.models.transaction import Transaction
from app.models.user import User
from app.repositories.passport_repository import PassportRepository
from app.repositories.provider_repository import ProviderRepository


async def _user_transactions(db: AsyncSession, user_id) -> list[Transaction]:
    stmt = (
        select(Transaction)
        .join(Business, Business.id == Transaction.business_id)
        .where(Business.owner_user_id == user_id)
    )
    result = await db.execute(stmt)
    return list(result.scalars().all())


async def _user_connections(db: AsyncSession, user_id) -> list[ProviderConnection]:
    result = await db.execute(select(ProviderConnection).where(ProviderConnection.user_id == user_id))
    return list(result.scalars().all())


async def _savings_total(db: AsyncSession, user_id) -> float:
    result = await db.execute(select(SavingsGoal).where(SavingsGoal.user_id == user_id))
    goals = result.scalars().all()
    return float(sum(float(g.current_amount) for g in goals))


def _member_since_display(user: User) -> str:
    return user.created_at.strftime("%B %Y")


async def recompute_and_store(db: AsyncSession, user: User) -> FinancialPassport:
    transactions = await _user_transactions(db, user.id)
    connections = await _user_connections(db, user.id)
    savings_total = await _savings_total(db, user.id)
    total_providers = len(await ProviderRepository(db).list_all())

    income = sum(float(t.amount) for t in transactions if t.type == TransactionTypeEnum.INCOME)
    income_txn_count = sum(1 for t in transactions if t.type == TransactionTypeEnum.INCOME)
    transaction_count = len(transactions)

    income_consistency = min(100, income_txn_count * 12)
    savings_behavior = min(100, round((savings_total / income) * 100)) if income > 0 else 0

    if transaction_count > 15:
        payment_activity = "High"
        activity_points = 100
    elif transaction_count > 5:
        payment_activity = "Moderate"
        activity_points = 65
    else:
        payment_activity = "Low"
        activity_points = 30

    repayment_behavior = 94  # illustrative constant — no loan/repayment ledger modeled yet

    connected_count = sum(1 for c in connections if c.status == ConnectionStatusEnum.CONNECTED)
    denom = max(1, total_providers - 1)
    financial_record_completeness = min(100, round((connected_count / denom) * 70) + (30 if transaction_count > 0 else 0))

    score = round(
        income_consistency * 0.3
        + savings_behavior * 0.2
        + activity_points * 0.2
        + repayment_behavior * 0.15
        + financial_record_completeness * 0.15
    )

    repo = PassportRepository(db)
    passport = await repo.get_for_user(user.id)
    now = datetime.now(timezone.utc)
    if passport is None:
        passport = FinancialPassport(user_id=user.id, computed_at=now)
        repo.add(passport)

    passport.income_consistency = income_consistency
    passport.savings_behavior = savings_behavior
    passport.payment_activity = payment_activity
    passport.repayment_behavior = repayment_behavior
    passport.financial_record_completeness = financial_record_completeness
    passport.business_activity_duration = _member_since_display(user)
    passport.score = score
    passport.computed_at = now

    await db.commit()
    await db.refresh(passport)
    return passport
