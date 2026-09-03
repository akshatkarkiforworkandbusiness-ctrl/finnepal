"""Audit-log write helper. Every admin handler that reads sensitive data calls
this — never logs secrets, only the action taken and which resource was
touched."""
from __future__ import annotations

import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.admin import AdminUser, AuditLog
from app.models.enums import AuditActionEnum


async def write_audit_log(
    db: AsyncSession,
    admin: AdminUser,
    action: AuditActionEnum,
    target_type: str | None = None,
    target_id: str | uuid.UUID | None = None,
    description: str | None = None,
) -> None:
    log = AuditLog(
        admin_user_id=admin.id,
        action=action,
        target_type=target_type,
        target_id=str(target_id) if target_id is not None else None,
        description=description,
    )
    db.add(log)
    await db.flush()
