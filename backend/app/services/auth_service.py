"""Admin authentication: login, rotating refresh tokens with reuse detection."""
from __future__ import annotations

from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.security import (
    create_access_token,
    create_refresh_token_value,
    hash_token,
    verify_password,
)
from app.models.admin import AdminUser
from app.models.enums import UserStatusEnum
from app.models.user import User
from app.repositories.admin_repository import AdminRefreshTokenRepository, AdminUserRepository
from app.repositories.user_repository import UserRefreshTokenRepository, UserRepository
from app.schemas.auth import TokenPair
from app.services import otp_service

settings = get_settings()


async def _issue_token_pair(db: AsyncSession, admin: AdminUser) -> TokenPair:
    access_token = create_access_token(subject=str(admin.id), role=admin.role.value)
    refresh_value = create_refresh_token_value()
    refresh_repo = AdminRefreshTokenRepository(db)
    from app.models.admin import AdminRefreshToken

    token_row = AdminRefreshToken(
        admin_user_id=admin.id,
        token_hash=hash_token(refresh_value),
        expires_at=datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    )
    refresh_repo.add(token_row)
    await db.flush()

    return TokenPair(
        access_token=access_token,
        refresh_token=refresh_value,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


async def login(db: AsyncSession, email: str, password: str) -> tuple[AdminUser, TokenPair]:
    repo = AdminUserRepository(db)
    admin = await repo.get_by_email(email)
    if admin is None or not admin.is_active or not verify_password(password, admin.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    admin.last_login_at = datetime.now(timezone.utc)
    tokens = await _issue_token_pair(db, admin)
    await db.commit()
    return admin, tokens


async def refresh(db: AsyncSession, refresh_token_value: str) -> TokenPair:
    """Rotating single-use refresh: the presented token is looked up by hash,
    must be un-revoked and unexpired, is immediately revoked, and a new pair is
    issued. Presenting an already-revoked token (reuse) revokes the *entire*
    session chain for that admin as a compromise response."""
    token_repo = AdminRefreshTokenRepository(db)
    admin_repo = AdminUserRepository(db)

    token_hash = hash_token(refresh_token_value)
    token_row = await token_repo.get_by_hash(token_hash)
    if token_row is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    now = datetime.now(timezone.utc)
    expires_at = token_row.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if token_row.revoked_at is not None:
        # Reuse of a rotated-out token: treat as compromised, kill the chain.
        await token_repo.revoke_all_for_admin(token_row.admin_user_id)
        await db.commit()
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token reuse detected; session revoked")

    if expires_at < now:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token expired")

    admin = await admin_repo.get(token_row.admin_user_id)
    if admin is None or not admin.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Admin account not found or inactive")

    token_row.revoked_at = now
    new_tokens = await _issue_token_pair(db, admin)

    # Link the old token row to whichever new row was just created, for audit trails.
    from sqlalchemy import select

    from app.models.admin import AdminRefreshToken

    result = await db.execute(
        select(AdminRefreshToken)
        .where(AdminRefreshToken.token_hash == hash_token(new_tokens.refresh_token))
    )
    new_row = result.scalar_one()
    token_row.replaced_by_id = new_row.id

    await db.commit()
    return new_tokens


# ─── Customer (email-OTP) auth ───


async def _issue_customer_token_pair(db: AsyncSession, user: User) -> TokenPair:
    access_token = create_access_token(subject=str(user.id), role="customer")
    refresh_value = create_refresh_token_value()
    refresh_repo = UserRefreshTokenRepository(db)
    from app.models.user import UserRefreshToken

    token_row = UserRefreshToken(
        user_id=user.id,
        token_hash=hash_token(refresh_value),
        expires_at=datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    )
    refresh_repo.add(token_row)
    await db.flush()

    return TokenPair(
        access_token=access_token,
        refresh_token=refresh_value,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


async def register_customer(db: AsyncSession, name: str, email: str, phone: str | None) -> bool:
    """Creates the user (status=PENDING) if the email is new, then always sends
    an OTP. Returns whether a new user row was created (False means this email
    already exists, so the caller should treat it like a login)."""
    repo = UserRepository(db)
    existing = await repo.get_by_email(email)
    if existing is not None:
        await otp_service.issue_and_send(db, email)
        return False

    user = User(name=name, email=email, phone=phone, status=UserStatusEnum.PENDING)
    repo.add(user)
    await db.commit()

    await otp_service.issue_and_send(db, email)
    return True


async def login_customer(db: AsyncSession, email: str) -> bool:
    """Sends an OTP if the email is registered. Returns whether the user exists."""
    repo = UserRepository(db)
    user = await repo.get_by_email(email)
    if user is None:
        return False

    await otp_service.issue_and_send(db, email)
    return True


async def verify_customer_otp(db: AsyncSession, email: str, code: str) -> TokenPair:
    await otp_service.verify(db, email, code)

    repo = UserRepository(db)
    user = await repo.get_by_email(email)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if user.status == UserStatusEnum.PENDING:
        user.status = UserStatusEnum.ACTIVE

    tokens = await _issue_customer_token_pair(db, user)
    await db.commit()
    return tokens


async def refresh_customer(db: AsyncSession, refresh_token_value: str) -> TokenPair:
    """Rotating single-use refresh for customer sessions; same reuse-detection
    semantics as `refresh` (admin)."""
    token_repo = UserRefreshTokenRepository(db)
    user_repo = UserRepository(db)

    token_hash = hash_token(refresh_token_value)
    token_row = await token_repo.get_by_hash(token_hash)
    if token_row is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    now = datetime.now(timezone.utc)
    expires_at = token_row.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if token_row.revoked_at is not None:
        await token_repo.revoke_all_for_user(token_row.user_id)
        await db.commit()
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token reuse detected; session revoked")

    if expires_at < now:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token expired")

    user = await user_repo.get(token_row.user_id)
    if user is None or user.status == UserStatusEnum.SUSPENDED:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Account not found or suspended")

    token_row.revoked_at = now
    new_tokens = await _issue_customer_token_pair(db, user)

    from sqlalchemy import select

    from app.models.user import UserRefreshToken

    result = await db.execute(
        select(UserRefreshToken).where(UserRefreshToken.token_hash == hash_token(new_tokens.refresh_token))
    )
    new_row = result.scalar_one()
    token_row.replaced_by_id = new_row.id

    await db.commit()
    return new_tokens
