from __future__ import annotations

import uuid

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.savings import SavingsGoal
from app.models.user import User
from app.repositories.savings_repository import SavingsRepository
from app.schemas.savings import SavingsGoalCreate, SavingsGoalRead, SavingsGoalUpdate


def to_read(goal: SavingsGoal) -> SavingsGoalRead:
    estimated_completion = goal.target_date.strftime("%b %Y") if goal.target_date else None
    return SavingsGoalRead(
        id=goal.id,
        user_id=goal.user_id,
        name=goal.name,
        target_amount=float(goal.target_amount),
        current_amount=float(goal.current_amount),
        monthly_contribution=float(goal.monthly_contribution),
        target_date=goal.target_date,
        status=goal.status,
        estimated_completion=estimated_completion,
        created_at=goal.created_at,
        updated_at=goal.updated_at,
    )


async def create_goal(db: AsyncSession, user: User, payload: SavingsGoalCreate) -> SavingsGoal:
    goal = SavingsGoal(user_id=user.id, **payload.model_dump())
    SavingsRepository(db).add(goal)
    await db.commit()
    await db.refresh(goal)
    return goal


async def list_goals(db: AsyncSession, user: User) -> list[SavingsGoal]:
    return await SavingsRepository(db).list_for_user(user.id)


async def get_owned_goal_or_404(db: AsyncSession, user: User, goal_id: uuid.UUID) -> SavingsGoal:
    goal = await SavingsRepository(db).get(goal_id)
    if goal is None or goal.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Savings goal not found")
    return goal


async def update_goal(db: AsyncSession, goal: SavingsGoal, payload: SavingsGoalUpdate) -> SavingsGoal:
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(goal, field, value)
    await db.commit()
    await db.refresh(goal)
    return goal


async def delete_goal(db: AsyncSession, goal: SavingsGoal) -> None:
    await SavingsRepository(db).delete(goal)
    await db.commit()
