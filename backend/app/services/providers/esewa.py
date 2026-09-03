"""eSewa provider adapter.

DEMO mode is fully implemented: synthetic, realistic transaction data with
zero network calls, delegating the actual generation to DemoProviderAdapter
(same shape every other DEMO provider uses).

LIVE mode is an intentional seam: it raises NotImplementedError with an
explanatory message. No undocumented eSewa API endpoints are called or
invented here — real LIVE integration is pending official eSewa
sandbox/production API access and documentation (see ESEWA_* settings in
app/core/config.py, currently unset placeholders).
"""
from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any

from app.core.config import get_settings
from app.models.enums import ConnectionStatusEnum
from app.services.providers.base import BaseProvider, NormalizedTransaction
from app.services.providers.demo import DemoProviderAdapter


class EsewaAdapter(BaseProvider):
    code = "esewa"

    def __init__(self):
        self._settings = get_settings()
        self._status = ConnectionStatusEnum.PENDING
        self._demo = DemoProviderAdapter(code=self.code)

    async def connect(self, *, user_id: uuid.UUID, mode: str) -> ConnectionStatusEnum:
        if mode == "LIVE":
            raise NotImplementedError("eSewa LIVE mode not yet implemented — pending official API integration")
        self._status = await self._demo.connect(user_id=user_id, mode=mode)
        return self._status

    async def disconnect(self) -> ConnectionStatusEnum:
        self._status = await self._demo.disconnect()
        return self._status

    def get_connection_status(self) -> ConnectionStatusEnum:
        return self._status

    async def fetch_transactions(self, *, since: datetime | None = None) -> list[dict[str, Any]]:
        if self._settings.ESEWA_MODE == "live":
            raise NotImplementedError("eSewa LIVE mode not yet implemented — pending official API integration")
        return await self._demo.fetch_transactions(since=since)

    def normalize_transaction(self, raw: dict[str, Any]) -> NormalizedTransaction:
        normalized = self._demo.normalize_transaction(raw)
        normalized.provider_code = self.code
        normalized.metadata["provider"] = self.code
        return normalized
