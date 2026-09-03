"""Admin authentication endpoints."""
from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.audit import write_audit_log
from app.core.database import get_db
from app.core.deps import get_current_admin
from app.models.admin import AdminUser
from app.models.enums import AuditActionEnum
from app.schemas.auth import (
    AdminLoginRequest,
    AdminMeResponse,
    AdminMeUpdate,
    AdminRefreshRequest,
    CustomerLoginRequest,
    CustomerRefreshRequest,
    CustomerRegisterRequest,
    CustomerResendOtpRequest,
    CustomerVerifyOtpRequest,
    OtpSentResponse,
    TokenPair,
)
from app.services import auth_service, otp_service

router = APIRouter()


@router.post(
    "/auth/admin/login",
    response_model=TokenPair,
    summary="Admin login",
    description="Authenticates an admin console user with email + password and returns a short-lived access "
    "token plus a rotating refresh token. Never accepts or returns customer credentials.",
)
async def admin_login(payload: AdminLoginRequest, db: AsyncSession = Depends(get_db)) -> TokenPair:
    admin, tokens = await auth_service.login(db, payload.email, payload.password)
    await write_audit_log(db, admin, AuditActionEnum.ADMIN_LOGIN, target_type="admin_user", target_id=admin.id)
    await db.commit()
    return tokens


@router.post(
    "/auth/admin/refresh",
    response_model=TokenPair,
    summary="Rotate admin refresh token",
    description="Exchanges a valid, unused refresh token for a new access/refresh pair. The presented token is "
    "revoked immediately (single-use rotation); presenting an already-used token revokes the whole session chain.",
)
async def admin_refresh(payload: AdminRefreshRequest, db: AsyncSession = Depends(get_db)) -> TokenPair:
    return await auth_service.refresh(db, payload.refresh_token)


@router.get(
    "/admin/me",
    response_model=AdminMeResponse,
    summary="Current admin profile",
    description="Returns the authenticated admin's own profile. Requires a valid admin access token.",
)
async def admin_me(admin: AdminUser = Depends(get_current_admin)) -> AdminUser:
    return admin


@router.patch(
    "/admin/me",
    response_model=AdminMeResponse,
    summary="Update my admin profile",
    description="Updates the authenticated admin's own name and/or photo_url. Email and role are not editable here.",
)
async def admin_me_update(
    payload: AdminMeUpdate, admin: AdminUser = Depends(get_current_admin), db: AsyncSession = Depends(get_db)
) -> AdminUser:
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(admin, field, value)
    await db.commit()
    await db.refresh(admin)
    return admin


@router.post(
    "/auth/customer/register",
    response_model=OtpSentResponse,
    summary="Register (customer)",
    description="Creates a customer account if the email is new and emails a one-time code. If the email is "
    "already registered, behaves like login (just sends a fresh code) and reports requires_registration=false.",
)
async def customer_register(payload: CustomerRegisterRequest, db: AsyncSession = Depends(get_db)) -> OtpSentResponse:
    created = await auth_service.register_customer(db, payload.name, payload.email, payload.phone)
    return OtpSentResponse(message="Verification code sent to your email", requires_registration=created)


@router.post(
    "/auth/customer/login",
    response_model=OtpSentResponse,
    summary="Login (customer)",
    description="Emails a one-time code if the address is registered. If it isn't, no email is sent and "
    "requires_registration=true is returned so the client can route to registration.",
)
async def customer_login(payload: CustomerLoginRequest, db: AsyncSession = Depends(get_db)) -> OtpSentResponse:
    exists = await auth_service.login_customer(db, payload.email)
    if not exists:
        return OtpSentResponse(message="No account found for this email", requires_registration=True)
    return OtpSentResponse(message="Verification code sent to your email", requires_registration=False)


@router.post(
    "/auth/customer/resend-otp",
    response_model=OtpSentResponse,
    summary="Resend OTP (customer)",
    description="Issues a fresh code for this email, invalidating any previously issued one.",
)
async def customer_resend_otp(payload: CustomerResendOtpRequest, db: AsyncSession = Depends(get_db)) -> OtpSentResponse:
    await otp_service.issue_and_send(db, payload.email)
    return OtpSentResponse(message="Verification code sent to your email", requires_registration=False)


@router.post(
    "/auth/customer/verify-otp",
    response_model=TokenPair,
    summary="Verify OTP and login (customer)",
    description="Verifies the emailed code and, on success, issues an access/refresh token pair. Activates the "
    "account (status PENDING -> ACTIVE) on first successful verification.",
)
async def customer_verify_otp(payload: CustomerVerifyOtpRequest, db: AsyncSession = Depends(get_db)) -> TokenPair:
    return await auth_service.verify_customer_otp(db, payload.email, payload.code)


@router.post(
    "/auth/customer/refresh",
    response_model=TokenPair,
    summary="Rotate customer refresh token",
    description="Exchanges a valid, unused refresh token for a new access/refresh pair. Single-use rotation with "
    "reuse detection, identical to the admin refresh flow.",
)
async def customer_refresh(payload: CustomerRefreshRequest, db: AsyncSession = Depends(get_db)) -> TokenPair:
    return await auth_service.refresh_customer(db, payload.refresh_token)
