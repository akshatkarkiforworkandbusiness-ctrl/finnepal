"""Maps a provider `code` to the adapter class that implements it."""
from __future__ import annotations

from app.services.providers.base import BaseProvider
from app.services.providers.demo import CashAdapter, DemoProviderAdapter
from app.services.providers.esewa import EsewaAdapter

_GENERIC_DEMO_CODES = [
    "khalti", "bank_demo", "fonepay", "nabil", "stripe", "connectips",
    "nicasia", "gibl", "kumari", "standardchartered",
]


def get_adapter(provider_code: str) -> BaseProvider:
    if provider_code == "esewa":
        return EsewaAdapter()
    if provider_code == "cash":
        return CashAdapter()
    if provider_code in _GENERIC_DEMO_CODES:
        return DemoProviderAdapter(code=provider_code)
    raise ValueError(f"No adapter registered for provider code: {provider_code}")
