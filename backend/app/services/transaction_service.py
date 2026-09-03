from __future__ import annotations

import uuid

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.transaction import Transaction
from app.models.user import User
from app.repositories.business_repository import BusinessRepository
from app.repositories.provider_repository import ProviderRepository
from app.repositories.transaction_repository import TransactionRepository
from app.schemas.transaction import TransactionCreate, TransactionRead, TransactionUpdate


def to_read(txn: Transaction) -> TransactionRead:
    """Manual ORM->DTO mapping: the ORM attribute is `transaction_metadata`
    (renamed to avoid shadowing SQLAlchemy's reserved `Base.metadata`), exposed
    to API consumers as `metadata` per the normalized transaction contract."""
    return TransactionRead(
        id=txn.id,
        business_id=txn.business_id,
        provider_id=txn.provider_id,
        external_reference=txn.external_reference,
        type=txn.type,
        source=txn.source,
        category=txn.category,
        amount=float(txn.amount),
        currency=txn.currency,
        status=txn.status,
        description=txn.description,
        occurred_at=txn.occurred_at,
        metadata=txn.transaction_metadata,
        created_at=txn.created_at,
    )


async def _assert_owns_business(db: AsyncSession, user: User, business_id: uuid.UUID) -> None:
    business = await BusinessRepository(db).get(business_id)
    if business is None or business.owner_user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Business not found")


async def create_transaction(db: AsyncSession, user: User, payload: TransactionCreate) -> Transaction:
    await _assert_owns_business(db, user, payload.business_id)

    provider = await ProviderRepository(db).get_by_code(payload.provider_code)
    if provider is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Unknown provider code: {payload.provider_code}")

    txn = Transaction(
        business_id=payload.business_id,
        provider_id=provider.id,
        external_reference=payload.external_reference,
        type=payload.type,
        source=payload.source,
        category=payload.category,
        amount=payload.amount,
        currency=payload.currency,
        status=payload.status,
        description=payload.description,
        occurred_at=payload.occurred_at,
        transaction_metadata={"mode": "MANUAL"},
    )
    TransactionRepository(db).add(txn)
    await db.commit()
    await db.refresh(txn)
    return txn


async def list_transactions_for_business(db: AsyncSession, user: User, business_id: uuid.UUID, page: int, page_size: int):
    await _assert_owns_business(db, user, business_id)
    return await TransactionRepository(db).list_for_business(business_id, page, page_size)


async def get_owned_transaction_or_404(db: AsyncSession, user: User, transaction_id: uuid.UUID) -> Transaction:
    txn = await TransactionRepository(db).get(transaction_id)
    if txn is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
    await _assert_owns_business(db, user, txn.business_id)
    return txn


async def update_transaction(db: AsyncSession, txn: Transaction, payload: TransactionUpdate) -> Transaction:
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(txn, field, value)
    await db.commit()
    await db.refresh(txn)
    return txn


async def delete_transaction(db: AsyncSession, txn: Transaction) -> None:
    await TransactionRepository(db).delete(txn)
    await db.commit()
