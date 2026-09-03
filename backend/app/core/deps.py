"""FastAPI dependencies: current-admin resolution, RBAC, and current-customer
resolution."""
from __future__ import annotations

import uuid

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.admin import AdminUser
from app.models.enums import AdminRoleEnum, UserStatusEnum
from app.models.user import User

bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_admin(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: AsyncSession = Depends(get_db),
) -> AdminUser:
    """Resolves the bearer JWT to a live, active AdminUser row. 401 on any
    missing/invalid/expired token, or an admin that no longer exists / is
    disabled."""
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    try:
        payload = decode_access_token(credentials.credentials)
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

    if payload.get("type") != "access":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")

    admin_id = payload.get("sub")
    if not admin_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    admin = await db.get(AdminUser, uuid.UUID(admin_id))
    if admin is None or not admin.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Admin account not found or inactive")
    return admin


def require_role(*roles: AdminRoleEnum):
    """Dependency factory: 403s unless the authenticated admin's role is one of
    `roles`. SUPER_ADMIN is always implicitly allowed."""

    async def _check(admin: AdminUser = Depends(get_current_admin)) -> AdminUser:
        if admin.role != AdminRoleEnum.SUPER_ADMIN and admin.role not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient role for this operation")
        return admin

    return _check


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Resolves the bearer JWT (issued by /auth/customer/verify-otp or
    /auth/customer/refresh) to a live, non-suspended User row. 401 on any
    missing/invalid/expired/wrong-role token, or a user that no longer exists
    / is suspended."""
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    try:
        payload = decode_access_token(credentials.credentials)
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

    if payload.get("type") != "access" or payload.get("role") != "customer":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    user = await db.get(User, uuid.UUID(user_id))
    if user is None or user.status == UserStatusEnum.SUSPENDED:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Account not found or suspended")
    return user
