from decimal import Decimal
from sqlalchemy.orm import Session
from app.db.models import Transaction, ReconciliationLog
from fastapi import HTTPException

class ReconciliationEngine:

    @classmethod
    def match_ledger_transactions(cls, db: Session, app_txn_id: str, bank_amount: float) -> Transaction:
        transaction = db.query(Transaction).filter(Transaction.idempotency_key == app_txn_id).first()
        if not transaction:
            raise HTTPException(status_code=404, detail="Transaction reference key not found.")
        target_amount = Decimal(str(transaction.amount))
        payout_amount = Decimal(str(bank_amount))
        variance = target_amount - payout_amount
        if variance == Decimal("0.00"):
            transaction.reconciliation_status = "MATCHED"
            transaction.variance_amount = Decimal("0.00")
            reconciliation_entry = ReconciliationLog(
                idempotency_key=transaction.idempotency_key,
                system_reconciled=True,
                discrepancy_value=Decimal("0.00")
            )
            db.add(reconciliation_entry)
        else:
            transaction.reconciliation_status = "REVIEW_NEEDED"
            transaction.variance_amount = variance
            reconciliation_entry = ReconciliationLog(
                idempotency_key=transaction.idempotency_key,
                system_reconciled=False,
                discrepancy_value=variance
            )
            db.add(reconciliation_entry)
        db.commit()
        db.refresh(transaction)
        return transaction

    @classmethod
    def resolve_variance(cls, db: Session, app_txn_id: str, allocated_ledger: str) -> Transaction:
        transaction = db.query(Transaction).filter(Transaction.idempotency_key == app_txn_id).first()
        if not transaction or transaction.reconciliation_status != "REVIEW_NEEDED":
            raise HTTPException(status_code=400, detail="Transaction not flagged for variance review.")
        recon_log = db.query(ReconciliationLog).filter(ReconciliationLog.idempotency_key == app_txn_id).first()
        if not recon_log:
            raise HTTPException(status_code=404, detail="Reconciliation metadata registry missing.")
        recon_log.expense_ledger_allocated = allocated_ledger
        recon_log.system_reconciled = True
        transaction.reconciliation_status = "MATCHED"
        transaction.variance_amount = Decimal("0.00")
        db.commit()
        db.refresh(transaction)
        return transaction
