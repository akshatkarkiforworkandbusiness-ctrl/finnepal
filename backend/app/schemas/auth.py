from __future__ import annotations

import uuid

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import AdminRoleEnum


class AdminLoginRequest(BaseModel):
    # Plain str (not EmailStr): Orbit's own admin/seed accounts intentionally use
    # non-public TLDs (orbit.local, orbit.demo) which email-validator's
    # reserved-TLD check would otherwise reject.
    email: str
    password: str = Field(min_length=1, description="Plain-text password, verified against the Argon2 hash server-side.")


class TokenPair(BaseModel):
    """Response of a successful login/refresh: a short-lived JWT access token
    plus a rotating opaque refresh token."""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = Field(description="Access token lifetime in seconds.")


class AdminRefreshRequest(BaseModel):
    refresh_token: str


class AdminMeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    email: str
    photo_url: str | None
    role: AdminRoleEnum
    is_active: bool


class AdminMeUpdate(BaseModel):
    """PATCH body for /admin/me — every field optional, only supplied ones change."""

    name: str | None = None
    photo_url: str | None = None


class CustomerRegisterRequest(BaseModel):
    name: str = Field(min_length=1)
    # Plain str (not EmailStr): see AdminLoginRequest above.
    email: str
    phone: str | None = None


class CustomerLoginRequest(BaseModel):
    email: str


class CustomerVerifyOtpRequest(BaseModel):
    email: str
    code: str = Field(min_length=1, max_length=10)


class CustomerResendOtpRequest(BaseModel):
    email: str


class CustomerRefreshRequest(BaseModel):
    refresh_token: str


class OtpSentResponse(BaseModel):
    """Returned by register/login before OTP verification. `requires_registration`
    tells the client whether to show the registration form (email unknown) or
    just the OTP-entry screen (email already registered)."""

    message: str
    requires_registration: bool
