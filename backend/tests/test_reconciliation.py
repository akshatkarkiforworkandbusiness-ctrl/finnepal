import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from decimal import Decimal
from fastapi import HTTPException

from app.db.base import Base
from app.db.models import Merchant, Transaction
from app.services.reconciliation import ReconciliationEngine

def get_session():
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    return sessionmaker(bind=engine)()

def create_merchant_and_txn(session, key, amount):
    merchant = Merchant(business_name="M", pan_number=key[:10])
    session.add(merchant)
    session.commit()
    txn = Transaction(idempotency_key=key, merchant_id=merchant.id, amount=amount, payment_channel="eSewa", created_at=datetime.utcnow())
    session.add(txn)
    session.commit()
    return txn

def test_auto_match():
    db = get_session()
    create_merchant_and_txn(db, "TXN-MATCH-1", 5000.00)
    result = ReconciliationEngine.match_ledger_transactions(db, "TXN-MATCH-1", 5000.00)
    assert result.reconciliation_status == "MATCHED"
    assert Decimal(str(result.variance_amount)) == Decimal("0.00")
    db.close()

def test_variance_review_needed():
    db = get_session()
    create_merchant_and_txn(db, "TXN-VAR-1", 5000.00)
    result = ReconciliationEngine.match_ledger_transactions(db, "TXN-VAR-1", 4800.00)
    assert result.reconciliation_status == "REVIEW_NEEDED"
    assert Decimal(str(result.variance_amount)) == Decimal("200.00")
    # Check log created
    from app.db.models import ReconciliationLog
    log = db.query(ReconciliationLog).filter_by(idempotency_key="TXN-VAR-1").first()
    assert log is not None
    assert log.system_reconciled is False
    assert Decimal(str(log.discrepancy_value)) == Decimal("200.00")
    db.close()

def test_resolve_variance():
    db = get_session()
    create_merchant_and_txn(db, "TXN-RES-1", 5000.00)
    ReconciliationEngine.match_ledger_transactions(db, "TXN-RES-1", 4800.00)
    result = ReconciliationEngine.resolve_variance(db, "TXN-RES-1", "Bank Transaction Fees")
    assert result.reconciliation_status == "MATCHED"
    assert Decimal(str(result.variance_amount)) == Decimal("0.00")
    from app.db.models import ReconciliationLog
    log = db.query(ReconciliationLog).filter_by(idempotency_key="TXN-RES-1").first()
    assert log.expense_ledger_allocated == "Bank Transaction Fees"
    assert log.system_reconciled is True
    db.close()

def test_resolve_not_flagged_fails():
    db = get_session()
    create_merchant_and_txn(db, "TXN-FAIL-1", 1000.00)
    # Not matched yet, trying to resolve should fail
    with pytest.raises(HTTPException) as exc:
        ReconciliationEngine.resolve_variance(db, "TXN-FAIL-1", "Fees")
    assert exc.value.status_code == 400
    db.close()

def test_missing_transaction_404():
    db = get_session()
    with pytest.raises(HTTPException) as exc:
        ReconciliationEngine.match_ledger_transactions(db, "NONEXIST", 100.0)
    assert exc.value.status_code == 404
    db.close()
