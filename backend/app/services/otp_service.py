"""OTP generation and verification for customer email login/register."""
from __future__ import annotations

import secrets
import smtplib
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.security import hash_token
from app.models.otp import UserOtpCode
from app.repositories.otp_repository import UserOtpCodeRepository
from app.services import email_service

settings = get_settings()


def _generate_code() -> str:
    return "".join(str(secrets.randbelow(10)) for _ in range(settings.OTP_LENGTH))


async def issue_and_send(db: AsyncSession, email: str) -> None:
    """Invalidates any still-active code for this email, issues a fresh one,
    and emails it. Commits — callers don't need to."""
    repo = UserOtpCodeRepository(db)
    await repo.invalidate_active(email)

    code = _generate_code()
    otp = UserOtpCode(
        email=email,
        code_hash=hash_token(code),
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=settings.OTP_EXPIRE_MINUTES),
    )
    repo.add(otp)
    await db.commit()

    try:
        await email_service.send_otp_email(email, code)
    except smtplib.SMTPException as exc:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="Could not send the verification email. Try again shortly.") from exc


async def verify(db: AsyncSession, email: str, code: str) -> None:
    """Raises HTTPException(400) if the code is missing/expired/wrong/exhausted;
    otherwise marks it consumed. Does not commit — caller does, as part of the
    same transaction that issues tokens."""
    repo = UserOtpCodeRepository(db)
    otp = await repo.get_latest_active(email)
    if otp is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired code")

    if otp.attempts >= settings.OTP_MAX_ATTEMPTS:
        otp.consumed_at = datetime.now(timezone.utc)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Too many attempts; request a new code")

    if hash_token(code) != otp.code_hash:
        otp.attempts += 1
        await db.commit()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired code")

    otp.consumed_at = datetime.now(timezone.utc)
