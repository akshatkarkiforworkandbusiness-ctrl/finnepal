"""Real eSewa/Khalti payment collection. Initiate endpoints are
customer-authed; callback endpoints are public (the provider redirects the
customer's browser here with no auth header) but never trust the redirect
itself — every callback re-verifies against the provider's own status API."""
from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status as http_status
from fastapi.responses import HTMLResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.payment import PaymentIntent
from app.models.user import User
from app.schemas.payment import EsewaInitiateResponse, KhaltiInitiateResponse, PaymentInitiateRequest, PaymentIntentRead
from app.services import payment_service

router = APIRouter()


def _result_page(success: bool) -> HTMLResponse:
    title = "Payment successful" if success else "Payment failed"
    color = "#0B3D2E" if success else "#C5161D"
    return HTMLResponse(
        f"<html><body style='font-family:sans-serif;text-align:center;padding:48px;'>"
        f"<h2 style='color:{color};'>{title}</h2>"
        f"<p>You can return to the Orbit app now.</p></body></html>"
    )


@router.post(
    "/payments/esewa/initiate",
    response_model=EsewaInitiateResponse,
    summary="Start an eSewa payment",
    description="Creates a payment intent and returns the eSewa v2 hosted-checkout form (URL + signed fields) to "
    "submit. The client should POST `form_fields` to `form_url` (e.g. an auto-submitting form / WebView).",
)
async def esewa_initiate(
    payload: PaymentInitiateRequest, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
) -> EsewaInitiateResponse:
    result = await payment_service.initiate_esewa(db, user, payload.business_id, payload.amount)
    return EsewaInitiateResponse(**result)


@router.get(
    "/payments/esewa/redirect/{payment_intent_id}",
    summary="eSewa auto-submit redirect page",
    description="A GET-able page that auto-submits the real signed checkout form. Open this one URL (e.g. "
    "`Linking.openURL` on mobile) instead of needing a WebView to POST a form. No auth — the intent id is an "
    "unguessable UUID, same trust model as the callback URLs.",
    response_class=HTMLResponse,
)
async def esewa_redirect(payment_intent_id: uuid.UUID, db: AsyncSession = Depends(get_db)) -> HTMLResponse:
    intent = await db.get(PaymentIntent, payment_intent_id)
    if intent is None:
        raise HTTPException(status_code=http_status.HTTP_404_NOT_FOUND, detail="Payment not found")
    return HTMLResponse(payment_service.render_esewa_redirect_html(intent))


@router.get(
    "/payments/esewa/callback",
    summary="eSewa return URL",
    description="eSewa redirects the customer's browser here after checkout. Re-verifies via eSewa's own "
    "transaction-status API before crediting anything — the redirect itself is never trusted.",
    response_class=HTMLResponse,
)
async def esewa_callback(intent: uuid.UUID = Query(...), db: AsyncSession = Depends(get_db)) -> HTMLResponse:
    result = await payment_service.handle_esewa_callback(db, intent)
    return _result_page(result.status.value == "COMPLETED")


@router.post(
    "/payments/khalti/initiate",
    response_model=KhaltiInitiateResponse,
    summary="Start a Khalti payment",
    description="Creates a payment intent and calls Khalti's real ePayment initiate API. Redirect the customer "
    "to the returned `payment_url` to complete checkout.",
)
async def khalti_initiate(
    payload: PaymentInitiateRequest, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
) -> KhaltiInitiateResponse:
    result = await payment_service.initiate_khalti(db, user, payload.business_id, payload.amount)
    return KhaltiInitiateResponse(**result)


@router.get(
    "/payments/khalti/callback",
    summary="Khalti return URL",
    description="Khalti redirects the customer's browser here after checkout. Re-verifies via Khalti's own "
    "lookup API before crediting anything — the redirect's query params are never trusted.",
    response_class=HTMLResponse,
)
async def khalti_callback(intent: uuid.UUID = Query(...), db: AsyncSession = Depends(get_db)) -> HTMLResponse:
    result = await payment_service.handle_khalti_callback(db, intent)
    return _result_page(result.status.value == "COMPLETED")


@router.get(
    "/payments/{payment_intent_id}",
    response_model=PaymentIntentRead,
    summary="Check a payment's status",
    description="Poll this after returning from checkout to find out whether the payment completed. Only the "
    "customer who initiated it can read it.",
)
async def get_payment(
    payment_intent_id: uuid.UUID, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
) -> PaymentIntentRead:
    intent = await db.get(PaymentIntent, payment_intent_id)
    if intent is None or intent.user_id != user.id:
        raise HTTPException(status_code=http_status.HTTP_404_NOT_FOUND, detail="Payment not found")
    return PaymentIntentRead.model_validate(intent)
