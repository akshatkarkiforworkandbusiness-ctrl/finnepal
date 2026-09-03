import uuid
from datetime import datetime
from sqlalchemy import String, Numeric, DateTime, ForeignKey, Index, Boolean, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base

class Merchant(Base):
    __tablename__ = "merchants"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    business_name: Mapped[str] = mapped_column(String(255), nullable=False)
    pan_number: Mapped[str] = mapped_column(String(20), unique=True, nullable=True)
    vat_registered: Mapped[bool] = mapped_column(Boolean, default=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    transactions = relationship("Transaction", back_populates="merchant", cascade="all, delete-orphan")
    parties = relationship("PartyDigitalKhata", back_populates="merchant", cascade="all, delete-orphan")

class Transaction(Base):
    __tablename__ = "transactions"

    idempotency_key: Mapped[str] = mapped_column(String(100), primary_key=True, index=True)
    merchant_id: Mapped[str] = mapped_column(ForeignKey("merchants.id", ondelete="CASCADE"), index=True)
    amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    raw_payload: Mapped[str] = mapped_column(Text, nullable=True)
    reconciliation_status: Mapped[str] = mapped_column(String(30), default="PENDING")
    variance_amount: Mapped[float] = mapped_column(Numeric(12, 2), default=0.00)
    payment_channel: Mapped[str] = mapped_column(String(50), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, index=True)

    merchant = relationship("Merchant", back_populates="transactions")
    tally_mapping = relationship("TallyMapping", uselist=False, back_populates="transaction", cascade="all, delete-orphan")
    reconciliation_log = relationship("ReconciliationLog", uselist=False, back_populates="transaction", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_merchant_reconciled", "merchant_id", "reconciliation_status"),
    )

class PartyDigitalKhata(Base):
    __tablename__ = "parties_digital_khata"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    merchant_id: Mapped[str] = mapped_column(ForeignKey("merchants.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=True)
    current_debt_balance: Mapped[float] = mapped_column(Numeric(12, 2), default=0.00)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    merchant = relationship("Merchant", back_populates="parties")

    __table_args__ = (
        UniqueConstraint("merchant_id", "name", name="uq_merchant_party_name"),
    )

class TallyMapping(Base):
    __tablename__ = "tally_mappings"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    idempotency_key: Mapped[str] = mapped_column(ForeignKey("transactions.idempotency_key", ondelete="CASCADE"), unique=True, nullable=False)
    tally_voucher_id: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    mapped_by_user_id: Mapped[str] = mapped_column(String(36), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    transaction = relationship("Transaction", back_populates="tally_mapping")

class ReconciliationLog(Base):
    __tablename__ = "reconciliation_logs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    idempotency_key: Mapped[str] = mapped_column(ForeignKey("transactions.idempotency_key", ondelete="CASCADE"), unique=True, nullable=False)
    system_reconciled: Mapped[bool] = mapped_column(Boolean, default=False)
    discrepancy_value: Mapped[float] = mapped_column(Numeric(12, 2), default=0.00)
    expense_ledger_allocated: Mapped[str] = mapped_column(String(100), nullable=True)
    processed_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    transaction = relationship("Transaction", back_populates="reconciliation_log")

class BFIConsent(Base):
    __tablename__ = "bfi_consents"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    merchant_id: Mapped[str] = mapped_column(ForeignKey("merchants.id", ondelete="CASCADE"), index=True)
    bfi_id: Mapped[str] = mapped_column(String(100), nullable=False)
    token_scope: Mapped[str] = mapped_column(String(255), nullable=False)
    encrypted_data_key: Mapped[str] = mapped_column(Text, nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
