"""Real eSewa/Khalti payment collection: initiate a checkout, verify it on
callback, and — on genuine success only — create exactly one Transaction.

This is deliberately separate from `app/services/providers/*` (account-
connection adapters that sync existing transaction history): eSewa and
Khalti's public APIs don't offer that. What they do offer is payment
collection — initiate, redirect, verify — which is what this module
implements for real, against their documented sandbox APIs.
"""
from __future__ import annotations

import base64
import hashlib
import hmac
import uuid
from datetime import datetime, timezone

import httpx
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.models.enums import (
    PaymentIntentStatusEnum,
    PaymentProviderEnum,
    TransactionSourceEnum,
    TransactionStatusEnum,
    TransactionTypeEnum,
)
from app.models.payment import PaymentIntent
from app.models.transaction import Transaction
from app.models.user import User
from app.repositories.provider_repository import ProviderRepository
from app.services import business_service

settings = get_settings()


async def _get_intent_or_404(db: AsyncSession, intent_id: uuid.UUID) -> PaymentIntent:
    intent = await db.get(PaymentIntent, intent_id)
    if intent is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment not found")
    return intent


async def _complete(db: AsyncSession, intent: PaymentIntent) -> None:
    """Idempotent: a retried/duplicate callback for an already-completed
    intent is a no-op, never a second Transaction."""
    if intent.status == PaymentIntentStatusEnum.COMPLETED:
        return

    provider_code = "esewa" if intent.provider == PaymentProviderEnum.ESEWA else "khalti"
    provider = await ProviderRepository(db).get_by_code(provider_code)
    if provider is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Provider '{provider_code}' not seeded")

    txn = Transaction(
        business_id=intent.business_id,
        provider_id=provider.id,
        type=TransactionTypeEnum.INCOME,
        source=TransactionSourceEnum.PROVIDER_API,
        category=f"{intent.provider.value.title()} Payment",
        amount=intent.amount,
        currency="NPR",
        status=TransactionStatusEnum.COMPLETED,
        description=f"Payment collected via {intent.provider.value.title()}",
        occurred_at=datetime.now(timezone.utc),
        external_reference=intent.provider_ref,
    )
    db.add(txn)
    await db.flush()

    intent.status = PaymentIntentStatusEnum.COMPLETED
    intent.transaction_id = txn.id
    await db.commit()


async def _fail(db: AsyncSession, intent: PaymentIntent, reason: str) -> None:
    if intent.status == PaymentIntentStatusEnum.PENDING:
        intent.status = PaymentIntentStatusEnum.FAILED
        intent.failure_reason = reason[:500]
        await db.commit()


# ─── eSewa ───


def _esewa_signature(total_amount: str, transaction_uuid: str, product_code: str) -> str:
    """Per eSewa's v2 docs: HMAC-SHA256 of the exact signed field string,
    base64-encoded (not hex)."""
    message = f"total_amount={total_amount},transaction_uuid={transaction_uuid},product_code={product_code}"
    digest = hmac.new(settings.ESEWA_SECRET_KEY.encode(), message.encode(), hashlib.sha256).digest()
    return base64.b64encode(digest).decode()


def _esewa_form_fields(intent: PaymentIntent) -> dict[str, str]:
    total_amount = f"{intent.amount:.2f}"
    transaction_uuid = intent.provider_ref
    signature = _esewa_signature(total_amount, transaction_uuid, settings.ESEWA_MERCHANT_ID)
    return {
        "amount": total_amount,
        "tax_amount": "0",
        "total_amount": total_amount,
        "transaction_uuid": transaction_uuid,
        "product_code": settings.ESEWA_MERCHANT_ID,
        "product_service_charge": "0",
        "product_delivery_charge": "0",
        "success_url": f"{settings.PUBLIC_BASE_URL}/api/v1/payments/esewa/callback?intent={intent.id}",
        "failure_url": f"{settings.PUBLIC_BASE_URL}/api/v1/payments/esewa/callback?intent={intent.id}",
        "signed_field_names": "total_amount,transaction_uuid,product_code",
        "signature": signature,
    }


async def initiate_esewa(db: AsyncSession, user: User, business_id: uuid.UUID, amount: float) -> dict:
    if not settings.ESEWA_MERCHANT_ID or not settings.ESEWA_SECRET_KEY:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="eSewa is not configured")
    await business_service.get_owned_business_or_404(db, user, business_id)

    intent = PaymentIntent(user_id=user.id, business_id=business_id, provider=PaymentProviderEnum.ESEWA, amount=amount)
    db.add(intent)
    await db.flush()

    intent.provider_ref = str(intent.id)
    await db.commit()

    form_fields = _esewa_form_fields(intent)
    return {
        "payment_intent_id": intent.id,
        "form_url": settings.ESEWA_FORM_URL,
        "form_fields": form_fields,
        "redirect_url": f"{settings.PUBLIC_BASE_URL}/api/v1/payments/esewa/redirect/{intent.id}",
    }


def render_esewa_redirect_html(intent: PaymentIntent) -> str:
    """A GET-able page that auto-submits the real signed POST form — lets a
    mobile client open one plain URL (system browser / Linking.openURL)
    instead of needing an in-app WebView to submit a form."""
    fields = _esewa_form_fields(intent)
    inputs = "\n".join(f'<input type="hidden" name="{k}" value="{v}">' for k, v in fields.items())
    return (
        "<html><body onload=\"document.forms[0].submit()\">"
        f'<form method="POST" action="{settings.ESEWA_FORM_URL}">{inputs}</form>'
        "<p>Redirecting to eSewa…</p>"
        "</body></html>"
    )


async def handle_esewa_callback(db: AsyncSession, intent_id: uuid.UUID) -> PaymentIntent:
    """Never trusts the redirect itself — always re-verifies against eSewa's
    own status API before crediting anything."""
    intent = await _get_intent_or_404(db, intent_id)
    if intent.provider != PaymentProviderEnum.ESEWA:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Not an eSewa payment")

    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.get(
            settings.ESEWA_STATUS_URL,
            params={
                "product_code": settings.ESEWA_MERCHANT_ID,
                "total_amount": f"{intent.amount:.2f}",
                "transaction_uuid": intent.provider_ref,
            },
        )
    data = resp.json() if resp.status_code == 200 else {}
    esewa_status = data.get("status")

    if esewa_status == "COMPLETE":
        await _complete(db, intent)
    else:
        await _fail(db, intent, f"eSewa status: {esewa_status or 'unreachable'}")
    return intent


# ─── Khalti ───


async def initiate_khalti(db: AsyncSession, user: User, business_id: uuid.UUID, amount: float) -> dict:
    if not settings.KHALTI_SECRET_KEY:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Khalti is not configured")
    business = await business_service.get_owned_business_or_404(db, user, business_id)

    intent = PaymentIntent(user_id=user.id, business_id=business_id, provider=PaymentProviderEnum.KHALTI, amount=amount)
    db.add(intent)
    await db.flush()
    await db.commit()

    payload = {
        "return_url": f"{settings.PUBLIC_BASE_URL}/api/v1/payments/khalti/callback?intent={intent.id}",
        "website_url": settings.PUBLIC_BASE_URL,
        "amount": round(amount * 100),  # paisa
        "purchase_order_id": str(intent.id),
        "purchase_order_name": f"Orbit payment — {business.name}",
        "customer_info": {"name": user.name, "email": user.email},
    }
    async with httpx.AsyncClient(timeout=15.0) as client:
        try:
            resp = await client.post(
                settings.KHALTI_INITIATE_URL,
                headers={"Authorization": f"Key {settings.KHALTI_SECRET_KEY}"},
                json=payload,
            )
            resp.raise_for_status()
        except httpx.HTTPError as exc:
            await _fail(db, intent, str(exc))
            raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=f"Khalti error: {exc}") from exc

    data = resp.json()
    intent.provider_ref = data["pidx"]
    await db.commit()

    return {"payment_intent_id": intent.id, "payment_url": data["payment_url"]}


async def handle_khalti_callback(db: AsyncSession, intent_id: uuid.UUID) -> PaymentIntent:
    """Never trusts the redirect query params — always re-verifies via
    Khalti's lookup API before crediting anything."""
    intent = await _get_intent_or_404(db, intent_id)
    if intent.provider != PaymentProviderEnum.KHALTI:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Not a Khalti payment")

    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.post(
            settings.KHALTI_VERIFY_URL,
            headers={"Authorization": f"Key {settings.KHALTI_SECRET_KEY}"},
            json={"pidx": intent.provider_ref},
        )
    data = resp.json() if resp.status_code == 200 else {}
    khalti_status = data.get("status")

    if khalti_status == "Completed":
        await _complete(db, intent)
    else:
        await _fail(db, intent, f"Khalti status: {khalti_status or 'unreachable'}")
    return intent
