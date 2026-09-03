"""Admin console API. Every handler here requires a valid admin JWT + a role
check via `require_role(...)` and writes an AuditLog row — never logs secrets,
only the action taken and which resource was viewed."""
from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.audit import write_audit_log
from app.core.config import get_settings
from app.core.database import get_db
from app.core.deps import get_current_admin, require_role
from app.models.admin import AdminUser
from app.models.enums import AdminRoleEnum, AuditActionEnum
from app.repositories.provider_repository import ProviderRepository
from app.schemas.admin import AuditLogRead, OverviewStats, RiskAlertRead, SupportTicketRead, UserAdminRead
from app.schemas.ai import AiUsageAdminRead, AiUsageOverview, AiUsageStats
from app.schemas.business import BusinessAdminRead
from app.schemas.common import Page, make_page
from app.schemas.consent import ConsentAdminRead
from app.schemas.provider import ConnectionRead, ProviderRead
from app.schemas.transaction import TransactionAdminRead
from app.services import admin_service
from app.services.cashflow_service import compute_cash_flow

router = APIRouter()

ALL_ADMIN_ROLES = (AdminRoleEnum.SUPER_ADMIN, AdminRoleEnum.OPERATIONS_ADMIN, AdminRoleEnum.SUPPORT_ADMIN, AdminRoleEnum.COMPLIANCE_ADMIN)


@router.get(
    "/admin/overview",
    response_model=OverviewStats,
    summary="Admin dashboard overview",
    description="High-level platform stats. Every total is computed live via SQL aggregation over the current "
    "data set (users, businesses, transactions, cash flow, open risk/support counts) — nothing is hardcoded. "
    "Accessible to every admin role.",
)
async def overview(admin: AdminUser = Depends(require_role(*ALL_ADMIN_ROLES)), db: AsyncSession = Depends(get_db)):
    stats = await admin_service.get_overview(db)
    await write_audit_log(db, admin, AuditActionEnum.OVERVIEW_VIEWED)
    await db.commit()
    return stats


@router.get(
    "/admin/users",
    response_model=Page[UserAdminRead],
    summary="List users",
    description="Paginated, searchable (by name/email) list of customers. Requires SUPER_ADMIN, OPERATIONS_ADMIN, "
    "or SUPPORT_ADMIN.",
)
async def list_users(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: str | None = Query(None),
    admin: AdminUser = Depends(require_role(AdminRoleEnum.OPERATIONS_ADMIN, AdminRoleEnum.SUPPORT_ADMIN)),
    db: AsyncSession = Depends(get_db),
):
    rows, total = await admin_service.list_users(db, page, page_size, search)
    items = [
        UserAdminRead(
            id=u.id, name=u.name, email=u.email, phone=u.phone, status=u.status.value,
            location=u.location, created_at=u.created_at, business_count=bc, transaction_count=tc,
        )
        for u, bc, tc in rows
    ]
    await write_audit_log(db, admin, AuditActionEnum.USER_VIEWED, target_type="user_list")
    await db.commit()
    return make_page(items, total, page, page_size)


@router.get(
    "/admin/users/{user_id}",
    response_model=UserAdminRead,
    summary="Get a user",
    description="Fetches a single customer's admin-facing detail. Requires SUPER_ADMIN, OPERATIONS_ADMIN, or "
    "SUPPORT_ADMIN.",
)
async def get_user(
    user_id: uuid.UUID,
    admin: AdminUser = Depends(require_role(AdminRoleEnum.OPERATIONS_ADMIN, AdminRoleEnum.SUPPORT_ADMIN)),
    db: AsyncSession = Depends(get_db),
):
    user = await admin_service.get_user(db, user_id)
    if user is None:
        from fastapi import HTTPException, status

        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    await write_audit_log(db, admin, AuditActionEnum.USER_VIEWED, target_type="user", target_id=user.id)
    await db.commit()
    return UserAdminRead(
        id=user.id, name=user.name, email=user.email, phone=user.phone, status=user.status.value,
        location=user.location, created_at=user.created_at,
    )


@router.get(
    "/admin/businesses",
    response_model=Page[BusinessAdminRead],
    summary="List businesses",
    description="Paginated list of businesses with owner name and live cash-flow totals. Requires SUPER_ADMIN, "
    "OPERATIONS_ADMIN, or SUPPORT_ADMIN.",
)
async def list_businesses(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    admin: AdminUser = Depends(require_role(AdminRoleEnum.OPERATIONS_ADMIN, AdminRoleEnum.SUPPORT_ADMIN)),
    db: AsyncSession = Depends(get_db),
):
    rows, total = await admin_service.list_businesses(db, page, page_size)
    items = []
    for biz, owner_name in rows:
        cf = await compute_cash_flow(db, biz.id)
        items.append(
            BusinessAdminRead(
                id=biz.id, owner_user_id=biz.owner_user_id, name=biz.name, type=biz.type, location=biz.location,
                activity=biz.activity, status=biz.status, created_at=biz.created_at, updated_at=biz.updated_at,
                owner_name=owner_name, total_income=cf.total_income, total_expense=cf.total_expense, net_cash_flow=cf.net_cash_flow,
            )
        )
    await write_audit_log(db, admin, AuditActionEnum.BUSINESS_VIEWED, target_type="business_list")
    await db.commit()
    return make_page(items, total, page, page_size)


@router.get(
    "/admin/businesses/{business_id}",
    response_model=BusinessAdminRead,
    summary="Get a business",
    description="Fetches a single business with owner name and live cash-flow totals. Requires SUPER_ADMIN, "
    "OPERATIONS_ADMIN, or SUPPORT_ADMIN.",
)
async def get_business(
    business_id: uuid.UUID,
    admin: AdminUser = Depends(require_role(AdminRoleEnum.OPERATIONS_ADMIN, AdminRoleEnum.SUPPORT_ADMIN)),
    db: AsyncSession = Depends(get_db),
):
    result = await admin_service.get_business(db, business_id)
    if result is None:
        from fastapi import HTTPException, status

        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Business not found")
    biz, owner_name = result
    cf = await compute_cash_flow(db, biz.id)
    await write_audit_log(db, admin, AuditActionEnum.BUSINESS_VIEWED, target_type="business", target_id=biz.id)
    await db.commit()
    return BusinessAdminRead(
        id=biz.id, owner_user_id=biz.owner_user_id, name=biz.name, type=biz.type, location=biz.location,
        activity=biz.activity, status=biz.status, created_at=biz.created_at, updated_at=biz.updated_at,
        owner_name=owner_name, total_income=cf.total_income, total_expense=cf.total_expense, net_cash_flow=cf.net_cash_flow,
    )


@router.get(
    "/admin/transactions",
    response_model=Page[TransactionAdminRead],
    summary="List transactions",
    description="Paginated list of all transactions (optionally filtered by business_id), read from the "
    "v_transactions_admin view. Requires SUPER_ADMIN, OPERATIONS_ADMIN, or COMPLIANCE_ADMIN.",
)
async def list_transactions(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    business_id: uuid.UUID | None = Query(None),
    admin: AdminUser = Depends(require_role(AdminRoleEnum.OPERATIONS_ADMIN, AdminRoleEnum.COMPLIANCE_ADMIN)),
    db: AsyncSession = Depends(get_db),
):
    rows, total = await admin_service.list_transactions_admin(db, page, page_size, business_id)
    items = [
        TransactionAdminRead(
            id=r["id"], business_id=r["business_id"], provider_id=r["provider_id"],
            external_reference=r["external_reference"], type=r["type"], source=r["source"],
            category=r["category"], amount=float(r["amount"]), currency=r["currency"], status=r["status"],
            description=r["description"], occurred_at=r["occurred_at"], metadata=r["metadata"],
            created_at=r["created_at"], business_name=r["business_name"], provider_name=r["provider_name"],
            provider_code=r["provider_code"],
        )
        for r in rows
    ]
    await write_audit_log(db, admin, AuditActionEnum.TRANSACTION_VIEWED, target_type="transaction_list")
    await db.commit()
    return make_page(items, total, page, page_size)


@router.get(
    "/admin/transactions/{transaction_id}",
    response_model=TransactionAdminRead,
    summary="Get a transaction",
    description="Fetches a single transaction's admin-facing detail. Requires SUPER_ADMIN, OPERATIONS_ADMIN, or "
    "COMPLIANCE_ADMIN.",
)
async def get_transaction(
    transaction_id: uuid.UUID,
    admin: AdminUser = Depends(require_role(AdminRoleEnum.OPERATIONS_ADMIN, AdminRoleEnum.COMPLIANCE_ADMIN)),
    db: AsyncSession = Depends(get_db),
):
    r = await admin_service.get_transaction_admin(db, transaction_id)
    if r is None:
        from fastapi import HTTPException, status

        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
    await write_audit_log(db, admin, AuditActionEnum.TRANSACTION_VIEWED, target_type="transaction", target_id=transaction_id)
    await db.commit()
    return TransactionAdminRead(
        id=r["id"], business_id=r["business_id"], provider_id=r["provider_id"],
        external_reference=r["external_reference"], type=r["type"], source=r["source"],
        category=r["category"], amount=float(r["amount"]), currency=r["currency"], status=r["status"],
        description=r["description"], occurred_at=r["occurred_at"], metadata=r["metadata"],
        created_at=r["created_at"], business_name=r["business_name"], provider_name=r["provider_name"],
        provider_code=r["provider_code"],
    )


@router.get(
    "/admin/providers",
    response_model=list[ProviderRead],
    summary="List providers (admin)",
    description="Full provider catalog including health status. Requires SUPER_ADMIN or OPERATIONS_ADMIN.",
)
async def admin_list_providers(
    admin: AdminUser = Depends(require_role(AdminRoleEnum.OPERATIONS_ADMIN)),
    db: AsyncSession = Depends(get_db),
):
    providers = await ProviderRepository(db).list_all()
    await write_audit_log(db, admin, AuditActionEnum.PROVIDER_VIEWED, target_type="provider_list")
    await db.commit()
    return providers


@router.get(
    "/admin/connections",
    response_model=Page[ConnectionRead],
    summary="List connections",
    description="Paginated list of all customer provider connections. Requires SUPER_ADMIN or OPERATIONS_ADMIN.",
)
async def admin_list_connections(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    admin: AdminUser = Depends(require_role(AdminRoleEnum.OPERATIONS_ADMIN)),
    db: AsyncSession = Depends(get_db),
):
    rows, total = await admin_service.list_connections_admin(db, page, page_size)
    items = [ConnectionRead.model_validate(c) for c, _user_name, _provider_name in rows]
    await write_audit_log(db, admin, AuditActionEnum.CONNECTION_VIEWED, target_type="connection_list")
    await db.commit()
    return make_page(items, total, page, page_size)


@router.get(
    "/admin/consents",
    response_model=Page[ConsentAdminRead],
    summary="List consents",
    description="Paginated list of all customer consents. Requires SUPER_ADMIN or COMPLIANCE_ADMIN.",
)
async def admin_list_consents(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    admin: AdminUser = Depends(require_role(AdminRoleEnum.COMPLIANCE_ADMIN)),
    db: AsyncSession = Depends(get_db),
):
    rows, total = await admin_service.list_consents_admin(db, page, page_size)
    items = [
        ConsentAdminRead(
            id=c.id, user_id=c.user_id, business_id=c.business_id, provider_id=c.provider_id, scope=c.scope,
            status=c.status, granted_at=c.granted_at, expires_at=c.expires_at, revoked_at=c.revoked_at,
            created_at=c.created_at, user_name=user_name, business_name=business_name, provider_name=provider_name,
        )
        for c, user_name, provider_name, business_name in rows
    ]
    await write_audit_log(db, admin, AuditActionEnum.CONSENT_VIEWED, target_type="consent_list")
    await db.commit()
    return make_page(items, total, page, page_size)


@router.get(
    "/admin/risk-alerts",
    response_model=Page[RiskAlertRead],
    summary="List risk alerts",
    description="Paginated list of all risk alerts. Requires SUPER_ADMIN, COMPLIANCE_ADMIN, or OPERATIONS_ADMIN.",
)
async def admin_list_risk_alerts(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    admin: AdminUser = Depends(require_role(AdminRoleEnum.COMPLIANCE_ADMIN, AdminRoleEnum.OPERATIONS_ADMIN)),
    db: AsyncSession = Depends(get_db),
):
    rows, total = await admin_service.list_risk_alerts_admin(db, page, page_size)
    items = [
        RiskAlertRead(
            id=r.id, business_id=r.business_id, business_name=biz_name, level=r.level, title=r.title,
            description=r.description, status=r.status, detected_at=r.detected_at, created_at=r.created_at,
        )
        for r, biz_name in rows
    ]
    await write_audit_log(db, admin, AuditActionEnum.RISK_VIEWED, target_type="risk_alert_list")
    await db.commit()
    return make_page(items, total, page, page_size)


@router.get(
    "/admin/audit-logs",
    response_model=Page[AuditLogRead],
    summary="List audit logs",
    description="Paginated, append-only log of every admin action. Requires SUPER_ADMIN or COMPLIANCE_ADMIN.",
)
async def admin_list_audit_logs(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    admin: AdminUser = Depends(require_role(AdminRoleEnum.COMPLIANCE_ADMIN)),
    db: AsyncSession = Depends(get_db),
):
    rows, total = await admin_service.list_audit_logs_admin(db, page, page_size)
    items = [
        AuditLogRead(
            id=a.id, admin_user_id=a.admin_user_id, admin_name=admin_name, action=a.action,
            target_type=a.target_type, target_id=a.target_id, description=a.description, created_at=a.created_at,
        )
        for a, admin_name in rows
    ]
    await write_audit_log(db, admin, AuditActionEnum.AUDIT_LOG_VIEWED, target_type="audit_log_list")
    await db.commit()
    return make_page(items, total, page, page_size)


@router.get(
    "/admin/support-tickets",
    response_model=Page[SupportTicketRead],
    summary="List support tickets",
    description="Paginated list of all support tickets. Requires SUPER_ADMIN or SUPPORT_ADMIN.",
)
async def admin_list_support_tickets(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    admin: AdminUser = Depends(require_role(AdminRoleEnum.SUPPORT_ADMIN)),
    db: AsyncSession = Depends(get_db),
):
    rows, total = await admin_service.list_support_tickets_admin(db, page, page_size)
    items = [
        SupportTicketRead(
            id=t.id, user_id=t.user_id, user_name=user_name, business_id=t.business_id, business_name=business_name,
            subject=t.subject, priority=t.priority, status=t.status, assignee=t.assignee,
            created_at=t.created_at, updated_at=t.updated_at,
        )
        for t, user_name, business_name in rows
    ]
    await write_audit_log(db, admin, AuditActionEnum.SUPPORT_TICKET_VIEWED, target_type="support_ticket_list")
    await db.commit()
    return make_page(items, total, page, page_size)


@router.get(
    "/admin/ai-usage",
    response_model=AiUsageOverview,
    summary="AI assistant usage",
    description="Aggregate call/token totals plus a paginated log of every Orbit AI call (prompt, response, "
    "tokens, model, which user/business). Requires SUPER_ADMIN or OPERATIONS_ADMIN.",
)
async def admin_ai_usage(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    admin: AdminUser = Depends(require_role(AdminRoleEnum.OPERATIONS_ADMIN)),
    db: AsyncSession = Depends(get_db),
):
    rows, total = await admin_service.list_ai_usage_admin(db, page, page_size)
    items = [
        AiUsageAdminRead(
            id=log.id, user_id=log.user_id, user_name=user_name, business_id=log.business_id, model=log.model,
            prompt=log.prompt, response=log.response, prompt_tokens=log.prompt_tokens,
            completion_tokens=log.completion_tokens, total_tokens=log.total_tokens, created_at=log.created_at,
        )
        for log, user_name in rows
    ]
    total_calls, total_tokens = await admin_service.get_ai_usage_stats(db)
    await write_audit_log(db, admin, AuditActionEnum.AI_USAGE_VIEWED, target_type="ai_usage_list")
    await db.commit()
    return AiUsageOverview(
        stats=AiUsageStats(total_calls=total_calls, total_tokens=total_tokens, rate_limit_per_minute=get_settings().AI_RATE_LIMIT_PER_MINUTE),
        page=make_page(items, total, page, page_size),
    )
