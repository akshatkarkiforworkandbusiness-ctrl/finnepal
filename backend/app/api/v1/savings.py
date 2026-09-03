from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.savings import SavingsGoalCreate, SavingsGoalRead, SavingsGoalUpdate
from app.services import savings_service

router = APIRouter()


@router.post("/savings", response_model=SavingsGoalRead, status_code=201, summary="Create a savings goal", description="Creates a savings goal for the calling customer.")
async def create_goal(payload: SavingsGoalCreate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    goal = await savings_service.create_goal(db, user, payload)
    return savings_service.to_read(goal)


@router.get("/savings", response_model=list[SavingsGoalRead], summary="List my savings goals", description="Lists all savings goals belonging to the calling customer.")
async def list_goals(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    goals = await savings_service.list_goals(db, user)
    return [savings_service.to_read(g) for g in goals]


@router.patch("/savings/{goal_id}", response_model=SavingsGoalRead, summary="Update a savings goal", description="Partially updates one of the calling customer's own savings goals.")
async def update_goal(goal_id: uuid.UUID, payload: SavingsGoalUpdate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    goal = await savings_service.get_owned_goal_or_404(db, user, goal_id)
    goal = await savings_service.update_goal(db, goal, payload)
    return savings_service.to_read(goal)


@router.delete("/savings/{goal_id}", status_code=204, summary="Delete a savings goal", description="Deletes one of the calling customer's own savings goals.")
async def delete_goal(goal_id: uuid.UUID, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    goal = await savings_service.get_owned_goal_or_404(db, user, goal_id)
    await savings_service.delete_goal(db, goal)
