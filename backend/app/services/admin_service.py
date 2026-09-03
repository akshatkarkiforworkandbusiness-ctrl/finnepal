"""Admin read-model queries. Every list/detail endpoint here backs an
`/admin/*` route; the router layer is responsible for RBAC + audit logging,
this module is responsible for building the actual (possibly joined) query."""
from __future__ import annotations

import uuid

from sqlalchemy import distinct, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.admin import AdminUser, AuditLog
from app.models.ai_usage import AiUsageLog
from app.models.business import Business
from app.models.consent import Consent
from app.models.enums import ConnectionStatusEnum
from app.models.provider import Provider, ProviderConnection
from app.models.risk import RiskAlert
from app.models.support import SupportTicket
from app.models.transaction import Transaction
from app.models.user import User
from app.schemas.admin import OverviewStats
from app.services.cashflow_service import compute_cash_flow


async def get_overview(db: AsyncSession) -> OverviewStats:
    cash_flow = await compute_cash_flow(db)

    total_users = (await db.execute(select(func.count()).select_from(User))).scalar_one()
    total_businesses = (await db.execute(select(func.count()).select_from(Business))).scalar_one()
    total_transactions = (await db.execute(select(func.count()).select_from(Transaction))).scalar_one()
    total_providers_connected = (
        await db.execute(
            select(func.count(distinct(ProviderConnection.provider_id))).where(
                ProviderConnection.status == ConnectionStatusEnum.CONNECTED
            )
        )
    ).scalar_one()
    open_risk_alerts = (
        await db.execute(select(func.count()).select_from(RiskAlert).where(RiskAlert.status == "OPEN"))
    ).scalar_one()
    open_support_tickets = (
        await db.execute(select(func.count()).select_from(SupportTicket).where(SupportTicket.status != "RESOLVED"))
    ).scalar_one()

    return OverviewStats(
        total_users=total_users,
        total_businesses=total_businesses,
        total_providers_connected=total_providers_connected,
        total_transactions=total_transactions,
        total_income=cash_flow.total_income,
        total_expense=cash_flow.total_expense,
        net_cash_flow=cash_flow.net_cash_flow,
        open_risk_alerts=open_risk_alerts,
        open_support_tickets=open_support_tickets,
    )


async def list_users(db: AsyncSession, page: int, page_size: int, search: str | None = None):
    biz_count = (
        select(Business.owner_user_id, func.count().label("business_count"))
        .group_by(Business.owner_user_id)
        .subquery()
    )
    txn_count = (
        select(Business.owner_user_id.label("owner_user_id"), func.count().label("transaction_count"))
        .select_from(Transaction)
        .join(Business, Business.id == Transaction.business_id)
        .group_by(Business.owner_user_id)
        .subquery()
    )
    stmt = (
        select(
            User,
            func.coalesce(biz_count.c.business_count, 0).label("business_count"),
            func.coalesce(txn_count.c.transaction_count, 0).label("transaction_count"),
        )
        .outerjoin(biz_count, biz_count.c.owner_user_id == User.id)
        .outerjoin(txn_count, txn_count.c.owner_user_id == User.id)
    )
    count_stmt = select(func.count()).select_from(User)
    if search:
        like = f"%{search}%"
        stmt = stmt.where((User.name.ilike(like)) | (User.email.ilike(like)))
        count_stmt = count_stmt.where((User.name.ilike(like)) | (User.email.ilike(like)))

    total = (await db.execute(count_stmt)).scalar_one()
    stmt = stmt.order_by(User.created_at.desc()).offset((page - 1) * page_size).limit(page_size)
    rows = (await db.execute(stmt)).all()
    return rows, total


async def get_user(db: AsyncSession, user_id: uuid.UUID) -> User | None:
    return await db.get(User, user_id)


async def list_businesses(db: AsyncSession, page: int, page_size: int):
    stmt = select(Business, User.name.label("owner_name")).join(User, User.id == Business.owner_user_id)
    count_stmt = select(func.count()).select_from(Business)
    total = (await db.execute(count_stmt)).scalar_one()
    stmt = stmt.order_by(Business.created_at.desc()).offset((page - 1) * page_size).limit(page_size)
    rows = (await db.execute(stmt)).all()
    return rows, total


async def get_business(db: AsyncSession, business_id: uuid.UUID):
    stmt = select(Business, User.name.label("owner_name")).join(User, User.id == Business.owner_user_id).where(Business.id == business_id)
    result = (await db.execute(stmt)).first()
    return result


async def list_transactions_admin(db: AsyncSession, page: int, page_size: int, business_id: uuid.UUID | None = None):
    from sqlalchemy import text

    where_clause = "WHERE business_id = :business_id" if business_id else ""
    params = {"business_id": business_id} if business_id else {}

    total_row = await db.execute(text(f"SELECT count(*) FROM v_transactions_admin {where_clause}"), params)
    total = total_row.scalar_one()

    query = text(
        f"SELECT * FROM v_transactions_admin {where_clause} ORDER BY occurred_at DESC OFFSET :offset LIMIT :limit"
    )
    params = {**params, "offset": (page - 1) * page_size, "limit": page_size}
    rows = (await db.execute(query, params)).mappings().all()
    return rows, total


async def get_transaction_admin(db: AsyncSession, transaction_id: uuid.UUID):
    from sqlalchemy import text

    result = await db.execute(text("SELECT * FROM v_transactions_admin WHERE id = :id"), {"id": transaction_id})
    return result.mappings().first()


async def list_connections_admin(db: AsyncSession, page: int, page_size: int):
    stmt = (
        select(ProviderConnection, User.name.label("user_name"), Provider.name.label("provider_name"))
        .join(User, User.id == ProviderConnection.user_id)
        .join(Provider, Provider.id == ProviderConnection.provider_id)
    )
    total = (await db.execute(select(func.count()).select_from(ProviderConnection))).scalar_one()
    stmt = stmt.order_by(ProviderConnection.created_at.desc()).offset((page - 1) * page_size).limit(page_size)
    rows = (await db.execute(stmt)).all()
    return rows, total


async def list_consents_admin(db: AsyncSession, page: int, page_size: int):
    stmt = (
        select(Consent, User.name.label("user_name"), Provider.name.label("provider_name"), Business.name.label("business_name"))
        .join(User, User.id == Consent.user_id)
        .join(Provider, Provider.id == Consent.provider_id)
        .outerjoin(Business, Business.id == Consent.business_id)
    )
    total = (await db.execute(select(func.count()).select_from(Consent))).scalar_one()
    stmt = stmt.order_by(Consent.created_at.desc()).offset((page - 1) * page_size).limit(page_size)
    rows = (await db.execute(stmt)).all()
    return rows, total


async def list_risk_alerts_admin(db: AsyncSession, page: int, page_size: int):
    stmt = select(RiskAlert, Business.name.label("business_name")).outerjoin(Business, Business.id == RiskAlert.business_id)
    total = (await db.execute(select(func.count()).select_from(RiskAlert))).scalar_one()
    stmt = stmt.order_by(RiskAlert.detected_at.desc()).offset((page - 1) * page_size).limit(page_size)
    rows = (await db.execute(stmt)).all()
    return rows, total


async def list_audit_logs_admin(db: AsyncSession, page: int, page_size: int):
    stmt = select(AuditLog, AdminUser.name.label("admin_name")).outerjoin(AdminUser, AdminUser.id == AuditLog.admin_user_id)
    total = (await db.execute(select(func.count()).select_from(AuditLog))).scalar_one()
    stmt = stmt.order_by(AuditLog.created_at.desc()).offset((page - 1) * page_size).limit(page_size)
    rows = (await db.execute(stmt)).all()
    return rows, total


async def list_support_tickets_admin(db: AsyncSession, page: int, page_size: int):
    stmt = (
        select(SupportTicket, User.name.label("user_name"), Business.name.label("business_name"))
        .outerjoin(User, User.id == SupportTicket.user_id)
        .outerjoin(Business, Business.id == SupportTicket.business_id)
    )
    total = (await db.execute(select(func.count()).select_from(SupportTicket))).scalar_one()
    stmt = stmt.order_by(SupportTicket.created_at.desc()).offset((page - 1) * page_size).limit(page_size)
    rows = (await db.execute(stmt)).all()
    return rows, total


async def list_ai_usage_admin(db: AsyncSession, page: int, page_size: int):
    stmt = select(AiUsageLog, User.name.label("user_name")).join(User, User.id == AiUsageLog.user_id)
    total = (await db.execute(select(func.count()).select_from(AiUsageLog))).scalar_one()
    stmt = stmt.order_by(AiUsageLog.created_at.desc()).offset((page - 1) * page_size).limit(page_size)
    rows = (await db.execute(stmt)).all()
    return rows, total


async def get_ai_usage_stats(db: AsyncSession) -> tuple[int, int]:
    """(total_calls, total_tokens)."""
    result = await db.execute(select(func.count(), func.coalesce(func.sum(AiUsageLog.total_tokens), 0)).select_from(AiUsageLog))
    row = result.one()
    return row[0], int(row[1])
