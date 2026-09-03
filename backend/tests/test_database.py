import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import IntegrityError
from datetime import datetime

from app.db.base import Base
from app.db.models import Merchant, Transaction

def get_test_session():
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    return Session()

def test_write_time_idempotency():
    session = get_test_session()
    merchant = Merchant(business_name="Test Merchant", pan_number="PAN123", phone="9800000000")
    session.add(merchant)
    session.commit()
    assert merchant.id is not None

    tx1 = Transaction(
        idempotency_key="TXN-UNIQUE-123",
        merchant_id=merchant.id,
        amount=5000.00,
        raw_payload='{"raw":"test"}',
        payment_channel="eSewa",
        created_at=datetime.utcnow(),
    )
    session.add(tx1)
    session.commit()
    assert tx1.idempotency_key == "TXN-UNIQUE-123"

    # Attempt duplicate insert must raise IntegrityError
    tx_dup = Transaction(
        idempotency_key="TXN-UNIQUE-123",
        merchant_id=merchant.id,
        amount=5000.00,
        raw_payload='{"raw":"dup"}',
        payment_channel="eSewa",
        created_at=datetime.utcnow(),
    )
    session.add(tx_dup)
    with pytest.raises(IntegrityError):
        session.commit()
    session.rollback()
    session.close()

def test_merchant_party_unique_constraint():
    from app.db.models import PartyDigitalKhata
    session = get_test_session()
    merchant = Merchant(business_name="M2", pan_number="PAN999")
    session.add(merchant)
    session.commit()
    p1 = PartyDigitalKhata(merchant_id=merchant.id, name="Ram", phone="9801111111")
    session.add(p1)
    session.commit()
    p2 = PartyDigitalKhata(merchant_id=merchant.id, name="Ram", phone="9802222222")
    session.add(p2)
    with pytest.raises(IntegrityError):
        session.commit()
    session.rollback()
    session.close()
