from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.db.session import get_db
from app.services.reconciliation import ReconciliationEngine

router = APIRouter(prefix="/transactions", tags=["transactions"])

class IngestRequest(BaseModel):
    idempotency_key: str
    merchant_id: str
    amount: float
    payment_channel: str
    raw_payload: str = ""

class MatchRequest(BaseModel):
    bank_amount: float

class ResolveRequest(BaseModel):
    allocated_ledger: str

@router.post("/ingest")
def ingest_transaction(payload: IngestRequest, db: Session = Depends(get_db)):
    from app.db.models import Transaction
    from datetime import datetime
    existing = db.query(Transaction).filter(Transaction.idempotency_key == payload.idempotency_key).first()
    if existing:
        raise HTTPException(status_code=409, detail="Duplicate idempotency_key")
    txn = Transaction(
        idempotency_key=payload.idempotency_key,
        merchant_id=payload.merchant_id,
        amount=payload.amount,
        payment_channel=payload.payment_channel,
        raw_payload=payload.raw_payload,
        created_at=datetime.utcnow(),
    )
    db.add(txn)
    db.commit()
    db.refresh(txn)
    return txn

@router.post("/{txn_id}/match")
def match_transaction(txn_id: str, body: MatchRequest, db: Session = Depends(get_db)):
    return ReconciliationEngine.match_ledger_transactions(db, txn_id, body.bank_amount)

@router.post("/{txn_id}/resolve")
def resolve_transaction(txn_id: str, body: ResolveRequest, db: Session = Depends(get_db)):
    return ReconciliationEngine.resolve_variance(db, txn_id, body.allocated_ledger)
