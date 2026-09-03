"""BaseProvider ABC — the contract every provider adapter implements.

Every adapter's `fetch_transactions()` output is normalized through
`normalize_transaction()` into the shared contract:
`provider, external_reference, amount, currency, type, source, status,
occurred_at, metadata` — this is what provider_service.py inserts as
`Transaction` rows, so admin/customer reads never need per-provider branching.
"""
from __future__ import annotations

import uuid
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any

from app.models.enums import ConnectionStatusEnum, TransactionSourceEnum, TransactionStatusEnum, TransactionTypeEnum


@dataclass
class NormalizedTransaction:
    """The normalized transaction contract shared by every adapter."""

    provider_code: str
    external_reference: str
    amount: float
    currency: str
    type: TransactionTypeEnum
    source: TransactionSourceEnum
    status: TransactionStatusEnum
    occurred_at: datetime
    category: str | None = None
    description: str | None = None
    metadata: dict[str, Any] = field(default_factory=dict)


class BaseProvider(ABC):
    """Abstract provider adapter. Concrete adapters must never make an
    undocumented/invented network call — DEMO mode is synthetic data only."""

    code: str

    @abstractmethod
    async def connect(self, *, user_id: uuid.UUID, mode: str) -> ConnectionStatusEnum:
        """Establishes (or simulates) a connection. Returns the resulting status."""

    @abstractmethod
    async def disconnect(self) -> ConnectionStatusEnum:
        """Tears down (or simulates tearing down) a connection."""

    @abstractmethod
    def get_connection_status(self) -> ConnectionStatusEnum:
        """Returns the adapter's view of current connection status."""

    @abstractmethod
    async def fetch_transactions(self, *, since: datetime | None = None) -> list[dict[str, Any]]:
        """Fetches raw provider-shaped transaction records (DEMO: synthetic; LIVE: real API)."""

    @abstractmethod
    def normalize_transaction(self, raw: dict[str, Any]) -> NormalizedTransaction:
        """Maps one raw provider record into the shared NormalizedTransaction contract."""
