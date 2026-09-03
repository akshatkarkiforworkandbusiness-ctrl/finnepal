"""Generic DEMO provider adapter, reused for khalti/bank_demo/fonepay/nabil/
stripe/connectips (and as the base behavior EsewaAdapter's DEMO branch calls
into). Generates realistic-looking synthetic transactions locally — zero
network calls — and tags every row `metadata.mode = "DEMO"` so nothing it
produces can be mistaken for a real financial transaction.
"""
from __future__ import annotations

import random
import uuid
from datetime import datetime, timedelta, timezone
from typing import Any

from app.models.enums import ConnectionStatusEnum, TransactionSourceEnum, TransactionStatusEnum, TransactionTypeEnum
from app.services.providers.base import BaseProvider, NormalizedTransaction

_INCOME_DESCRIPTIONS = ["Customer payment", "Wholesale order payment", "Catering order payment", "Direct customer sale"]
_EXPENSE_DESCRIPTIONS = ["Supplier payment", "Packaging supplies", "Utility bill", "Raw material purchase", "Rent"]
_CATEGORIES_INCOME = ["Business"]
_CATEGORIES_EXPENSE = ["Suppliers", "Utilities", "Food", "Other", "Transport"]


class DemoProviderAdapter(BaseProvider):
    """Reusable synthetic-data adapter for any DEMO-availability provider."""

    def __init__(self, code: str, seed: int | None = None):
        self.code = code
        self._status = ConnectionStatusEnum.PENDING
        self._rng = random.Random(seed)

    async def connect(self, *, user_id: uuid.UUID, mode: str) -> ConnectionStatusEnum:
        self._status = ConnectionStatusEnum.CONNECTED
        return self._status

    async def disconnect(self) -> ConnectionStatusEnum:
        self._status = ConnectionStatusEnum.REVOKED
        return self._status

    def get_connection_status(self) -> ConnectionStatusEnum:
        return self._status

    async def fetch_transactions(self, *, since: datetime | None = None) -> list[dict[str, Any]]:
        """Synthesizes a small, realistic batch of transactions. No network I/O."""
        now = datetime.now(timezone.utc)
        count = self._rng.randint(4, 8)
        rows: list[dict[str, Any]] = []
        for i in range(count):
            is_income = self._rng.random() < 0.45
            amount = round(self._rng.uniform(500, 15000), 2)
            occurred_at = now - timedelta(hours=self._rng.randint(1, 24 * 10), minutes=self._rng.randint(0, 59))
            rows.append(
                {
                    "reference": f"DEMO-{self.code.upper()}-{self._rng.randint(100000, 999999)}",
                    "amount": amount,
                    "type": "income" if is_income else "expense",
                    "category": self._rng.choice(_CATEGORIES_INCOME if is_income else _CATEGORIES_EXPENSE),
                    "description": self._rng.choice(_INCOME_DESCRIPTIONS if is_income else _EXPENSE_DESCRIPTIONS),
                    "occurred_at": occurred_at.isoformat(),
                }
            )
        return rows

    def normalize_transaction(self, raw: dict[str, Any]) -> NormalizedTransaction:
        return NormalizedTransaction(
            provider_code=self.code,
            external_reference=raw["reference"],
            amount=float(raw["amount"]),
            currency="NPR",
            type=TransactionTypeEnum.INCOME if raw["type"] == "income" else TransactionTypeEnum.EXPENSE,
            source=TransactionSourceEnum.PROVIDER_API,
            status=TransactionStatusEnum.COMPLETED,
            occurred_at=datetime.fromisoformat(raw["occurred_at"]),
            category=raw.get("category"),
            description=raw.get("description"),
            metadata={"mode": "DEMO", "provider": self.code},
        )


class CashAdapter(BaseProvider):
    """Trivial adapter for the `cash` provider: no connection state, no fetch —
    cash transactions are always entered manually via the transactions API."""

    code = "cash"

    async def connect(self, *, user_id: uuid.UUID, mode: str) -> ConnectionStatusEnum:
        return ConnectionStatusEnum.CONNECTED

    async def disconnect(self) -> ConnectionStatusEnum:
        return ConnectionStatusEnum.REVOKED

    def get_connection_status(self) -> ConnectionStatusEnum:
        return ConnectionStatusEnum.CONNECTED

    async def fetch_transactions(self, *, since: datetime | None = None) -> list[dict[str, Any]]:
        return []

    def normalize_transaction(self, raw: dict[str, Any]) -> NormalizedTransaction:
        raise NotImplementedError("Cash transactions are entered manually, never synced.")
