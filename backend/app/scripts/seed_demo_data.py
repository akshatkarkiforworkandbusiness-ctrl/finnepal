"""Transcribes both frontends' actual mock-data arrays into real DB rows, so
the running backend's numbers match what's already visible in the existing
OrbitAdmin console and ORBIT mobile prototype UIs instead of inventing new
figures.

Source of truth for every literal value below:
  - admin/src/lib/mock-data.ts (10 users/businesses, 28 transactions,
    5 risk alerts, 8 consents, 7 audit events, 5 support tickets)
  - mobile/src/data/mockData.ts (Maya Sharma, her 21
    transactions, 3 savings goals, 2 financing + 3 insurance opportunities)

Idempotent via --reset (wipes prior seed output first). Ends by calling
passport_service.recompute_and_store() for Maya so her Financial Passport is a
real computed output, not a hardcoded number. This script is intentionally
separate from create_admin.py — demo data seeding never creates admin
accounts.

Usage: python -m app.scripts.seed_demo_data [--reset]
"""
from __future__ import annotations

import asyncio
import uuid
from datetime import date, datetime, timedelta, timezone

import typer
from sqlalchemy import delete, select

from app.core.database import AsyncSessionLocal
from app.models.admin import AuditLog
from app.models.business import Business, BusinessMember
from app.models.consent import Consent
from app.models.enums import (
    AuditActionEnum,
    BusinessActivityEnum,
    BusinessMemberRoleEnum,
    BusinessStatusEnum,
    ConsentStatusEnum,
    OpportunityKindEnum,
    RiskLevelEnum,
    RiskStatusEnum,
    SavingsGoalStatusEnum,
    SupportPriorityEnum,
    SupportStatusEnum,
    TransactionSourceEnum,
    TransactionStatusEnum,
    TransactionTypeEnum,
    UserStatusEnum,
)
from app.models.opportunity import Opportunity
from app.models.provider import Provider
from app.models.risk import RiskAlert
from app.models.savings import SavingsGoal
from app.models.support import SupportTicket
from app.models.transaction import Transaction
from app.models.user import User
from app.services import passport_service

app = typer.Typer(add_completion=False)

NOW = datetime(2026, 8, 18, 8, 32, tzinfo=timezone.utc)  # matches mock data's "current" timestamp

# ---------------------------------------------------------------------------
# OrbitAdmin mock-data.ts, transcribed verbatim
# ---------------------------------------------------------------------------
OWNERS = ["Amit Pokhrel", "Sita Shrestha", "Ram Karki", "Gita Thapa", "Hari Adhikari", "Bina Rai", "Nabin Gurung", "Puja Magar", "Deepak Lama", "Anita Basnet"]
BIZ_NAMES = ["Amit Mobile Store", "Sita Boutique", "Ram Electronics", "Gita Grocery", "Hari Hardware", "Bina Tailors", "Nabin Cafe", "Puja Salon", "Deepak Motors", "Anita Pharmacy"]
TYPES = ["Retail", "Fashion", "Electronics", "Grocery", "Hardware", "Services", "Food & Beverage", "Beauty", "Automotive", "Healthcare"]
LOCATIONS = ["Itahari", "Kathmandu", "Pokhara", "Biratnagar", "Lalitpur", "Dharan", "Butwal", "Bhaktapur", "Chitwan", "Birgunj"]
USER_STATUSES = ["Active", "Active", "Active", "Pending", "Suspended", "Active", "Active", "Pending", "Active", "Active"]
BIZ_STATUSES = ["Active", "Active", "Active", "Pending", "Suspended"]
ACTIVITY_LEVELS = ["High", "Medium", "Low"]

PROV_NAMES = ["Khalti", "eSewa", "Fonepay", "Bank Demo"]
PROV_CODES = {"Khalti": "khalti", "eSewa": "esewa", "Fonepay": "fonepay", "Bank Demo": "bank_demo"}
TX_TYPES = ["Sale", "Refund", "Payout", "Expense"]
TX_STATUS = ["Completed", "Completed", "Completed", "Pending", "Failed", "Completed"]

CONSENT_SCOPES = ["Transactions, Balance", "Transactions", "Balance, Profile", "Transactions, Profile"]
CONSENT_STATUSES = ["Granted", "Granted", "Pending", "Revoked", "Expired"]

RISK_ALERTS_MOCK = [
    dict(level="High", title="Unusual transaction pattern", description="Sudden 6x spike in transaction volume outside normal hours.", business="Ram Electronics", minutes_ago=12, status="Open"),
    dict(level="Medium", title="Repeated failed connection", description="5 consecutive provider connection failures on Bank Demo.", business="Sita Boutique", minutes_ago=48, status="Investigating"),
    dict(level="Low", title="Incomplete business profile", description="Business verification documents pending for over 14 days.", business="Gita Grocery", minutes_ago=180, status="Open"),
    dict(level="Medium", title="Consent nearing expiry", description="Data-sharing consent expires in 3 days for a connected provider.", business="Hari Hardware", minutes_ago=300, status="Open"),
    dict(level="Low", title="Stale sync window", description="No successful sync recorded in the last 24 hours.", business="Bina Tailors", minutes_ago=480, status="Resolved"),
]

AUDIT_EVENTS_MOCK = [
    dict(actor="Orbit Admin", action="Viewed transaction record", target="TX-829102", category="Access"),
    dict(actor="Priya (Compliance)", action="Updated risk alert status", target="RA-4820", category="Security"),
    dict(actor="System", action="Provider sync completed", target="Khalti Business", category="Data"),
    dict(actor="Orbit Admin", action="Suspended user account", target="USR-1005", category="Security"),
    dict(actor="Rohan (Ops)", action="Changed system setting", target="Sync interval -> 5 min", category="Config"),
    dict(actor="System", action="Consent auto-expired", target="CNS-5007", category="Data"),
    dict(actor="Orbit Admin", action="Exported business report", target="BIZ-2003", category="Access"),
]
_AUDIT_ACTION_MAP = {
    "Viewed transaction record": AuditActionEnum.TRANSACTION_VIEWED,
    "Updated risk alert status": AuditActionEnum.RISK_VIEWED,
    "Provider sync completed": AuditActionEnum.PROVIDER_VIEWED,
    "Suspended user account": AuditActionEnum.USER_VIEWED,
    "Changed system setting": AuditActionEnum.OVERVIEW_VIEWED,
    "Consent auto-expired": AuditActionEnum.CONSENT_VIEWED,
    "Exported business report": AuditActionEnum.BUSINESS_VIEWED,
}

SUPPORT_TICKETS_MOCK = [
    dict(subject="Provider sync stuck on Bank Demo", user="Ram Karki", business="Ram Electronics", priority="Urgent", status="Open", assignee="Rohan", minutes_ago=8),
    dict(subject="Cannot reconnect eSewa account", user="Sita Shrestha", business="Sita Boutique", priority="High", status="Pending", assignee="Priya", minutes_ago=34),
    dict(subject="Transactions missing from last week", user="Hari Adhikari", business="Hari Hardware", priority="Normal", status="Open", assignee="Unassigned", minutes_ago=60),
    dict(subject="How do I export monthly report?", user="Gita Thapa", business="Gita Grocery", priority="Low", status="Resolved", assignee="Rohan", minutes_ago=180),
    dict(subject="Duplicate transaction showing twice", user="Amit Pokhrel", business="Amit Mobile Store", priority="High", status="Pending", assignee="Priya", minutes_ago=300),
]

# ---------------------------------------------------------------------------
# ORBIT mobile prototype mockData.ts, transcribed verbatim (Maya Sharma)
# ---------------------------------------------------------------------------
MAYA = dict(
    name="Maya Sharma",
    email="maya.sharma@example.com",
    phone="+977 9812345521",
    user_type="Small business owner",
    location="Lalitpur, Nepal",
    financial_goal="Grow my business",
    occupation="Home-based food entrepreneur",
    member_since=datetime(2024, 3, 1, tzinfo=timezone.utc),
)

MAYA_TRANSACTIONS = [
    dict(provider="esewa", type="income", amount=2500, category="Business", description="Customer payment", timestamp="2026-08-17T10:30:00", status="completed", reference="ORB-TXN-88213"),
    dict(provider="khalti", type="expense", amount=1500, category="Suppliers", description="Supplier payment", timestamp="2026-08-17T08:15:00", status="completed", reference="ORB-TXN-88214"),
    dict(provider="nabil", type="income", amount=12000, category="Business", description="Salary / business income", timestamp="2026-08-16T15:00:00", status="completed", reference="ORB-TXN-88190"),
    dict(provider="cash", type="expense", amount=800, category="Business", description="Business expense", timestamp="2026-08-16T13:00:00", status="completed", reference="ORB-TXN-88191"),
    dict(provider="esewa", type="expense", amount=2350, category="Food", description="Kalimati market - vegetables", timestamp="2026-08-16T08:10:00", status="completed", reference="ORB-TXN-88180"),
    dict(provider="nabil", type="expense", amount=1850, category="Utilities", description="Nepal Electricity Authority", timestamp="2026-08-15T15:00:00", status="completed", reference="ORB-TXN-88160"),
    dict(provider="khalti", type="income", amount=6200, category="Business", description="Customer payment - catering order", timestamp="2026-08-15T11:20:00", status="completed", reference="ORB-TXN-88161"),
    dict(provider="cash", type="expense", amount=300, category="Transport", description="Microbus - Ratnapark to Patan", timestamp="2026-08-15T09:00:00", status="completed", reference="ORB-TXN-88150"),
    dict(provider="nabil", type="expense", amount=5000, category="Savings", description="Transfer to savings", timestamp="2026-08-14T18:00:00", status="completed", reference="ORB-TXN-88140"),
    dict(provider="esewa", type="income", amount=3400, category="Business", description="Customer payment", timestamp="2026-08-14T14:40:00", status="completed", reference="ORB-TXN-88141"),
    dict(provider="khalti", type="expense", amount=2100, category="Business", description="Packaging supplies", timestamp="2026-08-14T10:15:00", status="completed", reference="ORB-TXN-88120"),
    dict(provider="cash", type="income", amount=1800, category="Business", description="Market stall sales", timestamp="2026-08-13T17:30:00", status="completed", reference="ORB-TXN-88110"),
    dict(provider="nabil", type="expense", amount=18000, category="Other", description="Rent", timestamp="2026-08-13T09:00:00", status="completed", reference="ORB-TXN-88100"),
    dict(provider="esewa", type="expense", amount=18500, category="Other", description="Transfer to unknown recipient", timestamp="2026-08-17T11:52:00", status="flagged", reference="ORB-TXN-88240"),
    dict(provider="khalti", type="income", amount=4200, category="Business", description="Customer payment", timestamp="2026-08-12T13:10:00", status="completed", reference="ORB-TXN-88090"),
    dict(provider="cash", type="expense", amount=650, category="Food", description="Groceries", timestamp="2026-08-12T09:40:00", status="completed", reference="ORB-TXN-88080"),
    dict(provider="nabil", type="income", amount=9500, category="Business", description="Wholesale order payment", timestamp="2026-08-11T16:00:00", status="completed", reference="ORB-TXN-88070"),
    dict(provider="esewa", type="expense", amount=1200, category="Utilities", description="Mobile recharge & internet", timestamp="2026-08-11T10:00:00", status="completed", reference="ORB-TXN-88060"),
    dict(provider="khalti", type="expense", amount=3600, category="Suppliers", description="Raw material purchase", timestamp="2026-08-10T12:20:00", status="completed", reference="ORB-TXN-88050"),
    dict(provider="cash", type="income", amount=2200, category="Business", description="Direct customer sale", timestamp="2026-08-10T08:30:00", status="completed", reference="ORB-TXN-88040"),
    dict(provider="nabil", type="expense", amount=5000, category="Savings", description="Loan repayment - SKBBL", timestamp="2026-08-09T14:00:00", status="completed", reference="ORB-TXN-88030"),
]

MAYA_SAVINGS_GOALS = [
    dict(name="Emergency Fund", target=100000, current=35000, monthly=5000, completion=date(2027, 1, 1)),
    dict(name="Business Equipment", target=50000, current=20000, monthly=4000, completion=date(2026, 11, 1)),
    dict(name="Education", target=75000, current=45000, monthly=3500, completion=date(2026, 10, 1)),
]

FINANCING_OPTIONS = [
    dict(title="Working Capital", max_amount=100000, note="Based on your financial profile"),
    dict(title="Equipment Financing", max_amount=150000, note="Based on your business activity"),
]

INSURANCE_OPTIONS = [
    dict(title="Health protection", description="Protect yourself from unexpected medical costs.", estimated_premium="~Rs. 450/month"),
    dict(title="Business protection", description="Protect your business from selected disruptions.", estimated_premium="~Rs. 600/month"),
    dict(title="Income protection", description="For people depending on one primary income source.", estimated_premium="~Rs. 350/month"),
]


def _aug_2026(day_offset_expr: int) -> datetime:
    day = 18 - day_offset_expr
    return datetime(2026, 8, day, 9, 0, tzinfo=timezone.utc)


def _feb_2027(day_offset_expr: int) -> datetime:
    day = 10 - day_offset_expr
    return datetime(2027, 2, max(day, 1), 9, 0, tzinfo=timezone.utc)


def _aug_10_2026(day_offset_expr: int) -> datetime:
    day = 10 - day_offset_expr
    return datetime(2026, 8, max(day, 1), 9, 0, tzinfo=timezone.utc)


async def _reset(db) -> None:
    await db.execute(delete(SupportTicket))
    await db.execute(delete(RiskAlert))
    await db.execute(delete(Opportunity))
    await db.execute(delete(AuditLog).where(AuditLog.admin_user_id.is_(None)))
    await db.execute(delete(User))  # cascades businesses/transactions/consents/connections/savings/passports
    await db.commit()


async def _get_provider_map(db) -> dict[str, Provider]:
    result = await db.execute(select(Provider))
    return {p.code: p for p in result.scalars().all()}


async def _seed(reset: bool) -> None:
    async with AsyncSessionLocal() as db:
        if reset:
            await _reset(db)

        providers = await _get_provider_map(db)

        # --- users + businesses (OrbitAdmin) ---
        users: list[User] = []
        for i, name in enumerate(OWNERS):
            u = User(
                name=name,
                email=f"{name.split()[0].lower()}@orbit.demo",
                phone=f"+977 98{str(10000000 + i * 137)[:8]}",
                status=UserStatusEnum(USER_STATUSES[i].upper()),
                location=LOCATIONS[i],
            )
            db.add(u)
            users.append(u)
        await db.flush()

        businesses: list[Business] = []
        for i, name in enumerate(BIZ_NAMES):
            b = Business(
                owner_user_id=users[i].id,
                name=name,
                type=TYPES[i],
                location=LOCATIONS[i],
                activity=BusinessActivityEnum(ACTIVITY_LEVELS[i % 3].upper()),
                status=BusinessStatusEnum(BIZ_STATUSES[i % 5].upper()),
            )
            db.add(b)
            businesses.append(b)
        await db.flush()
        for u, b in zip(users, businesses):
            db.add(BusinessMember(business_id=b.id, user_id=u.id, role=BusinessMemberRoleEnum.OWNER))
        await db.flush()

        biz_by_name = {b.name: b for b in businesses}
        user_by_name = {u.name: u for u in users}

        # --- 28 admin transactions ---
        for i in range(28):
            b = businesses[i % len(businesses)]
            prov_name = PROV_NAMES[i % 4]
            provider = providers[PROV_CODES[prov_name]]
            tx_type_label = TX_TYPES[i % 4]
            txn_type = TransactionTypeEnum.EXPENSE if tx_type_label == "Expense" else TransactionTypeEnum.INCOME
            amount = 2500 + (i % 9) * 1450
            status_label = TX_STATUS[i % 6]
            status = TransactionStatusEnum(status_label.upper())
            source = TransactionSourceEnum.BANK_FEED if i % 4 == 3 else TransactionSourceEnum.PROVIDER_API
            reference = f"DEMO-{prov_name[:2].upper()}-{829102 - i}"
            occurred_at = _aug_2026(i % 14)
            db.add(
                Transaction(
                    business_id=b.id,
                    provider_id=provider.id,
                    external_reference=reference,
                    type=txn_type,
                    source=source,
                    category=tx_type_label,
                    amount=amount,
                    currency="NPR",
                    status=status,
                    description=f"{tx_type_label} via {prov_name}",
                    occurred_at=occurred_at,
                    transaction_metadata={"mode": "DEMO", "seed": "orbit_admin_mock"},
                )
            )

        # --- 8 consents ---
        for i in range(8):
            b = businesses[i]
            prov_name = PROV_NAMES[i % 4]
            provider = providers[PROV_CODES[prov_name]]
            scope = [s.strip() for s in CONSENT_SCOPES[i % 4].split(",")]
            status_label = CONSENT_STATUSES[i % 5]
            db.add(
                Consent(
                    user_id=b.owner_user_id,
                    business_id=b.id,
                    provider_id=provider.id,
                    scope=scope,
                    status=ConsentStatusEnum(status_label.upper()),
                    granted_at=_aug_10_2026(i % 8),
                    expires_at=_feb_2027(i % 8),
                )
            )

        # --- 5 risk alerts ---
        for alert in RISK_ALERTS_MOCK:
            b = biz_by_name[alert["business"]]
            db.add(
                RiskAlert(
                    business_id=b.id,
                    level=RiskLevelEnum(alert["level"].upper()),
                    title=alert["title"],
                    description=alert["description"],
                    status=RiskStatusEnum(alert["status"].upper() if alert["status"] != "Investigating" else "INVESTIGATING"),
                    detected_at=NOW - timedelta(minutes=alert["minutes_ago"]),
                )
            )

        # --- 7 audit events (transcribed from admin mock; admin_user_id left
        # NULL since these predate/are-external-to this backend's own admin
        # accounts — the original actor name is preserved in `description`) ---
        for idx, ev in enumerate(AUDIT_EVENTS_MOCK):
            db.add(
                AuditLog(
                    admin_user_id=None,
                    action=_AUDIT_ACTION_MAP[ev["action"]],
                    target_type=ev["category"],
                    target_id=ev["target"],
                    description=f"{ev['actor']}: {ev['action']}",
                )
            )

        # --- 5 support tickets ---
        for t in SUPPORT_TICKETS_MOCK:
            db.add(
                SupportTicket(
                    user_id=user_by_name[t["user"]].id,
                    business_id=biz_by_name[t["business"]].id,
                    subject=t["subject"],
                    priority=SupportPriorityEnum(t["priority"].upper()),
                    status=SupportStatusEnum(t["status"].upper()),
                    assignee=None if t["assignee"] == "Unassigned" else t["assignee"],
                )
            )

        # --- Maya Sharma (mobile prototype) ---
        maya = User(
            name=MAYA["name"],
            email=MAYA["email"],
            phone=MAYA["phone"],
            status=UserStatusEnum.ACTIVE,
            location=MAYA["location"],
            user_type=MAYA["user_type"],
            financial_goal=MAYA["financial_goal"],
            occupation=MAYA["occupation"],
        )
        db.add(maya)
        await db.flush()
        # Backfill created_at to match the mobile app's memberSince ("March 2024") —
        # server_default only applies when no value is supplied at INSERT time,
        # so this UPDATE reflects the true mock member-since date.
        maya.created_at = MAYA["member_since"]
        await db.flush()

        maya_business = Business(
            owner_user_id=maya.id,
            name="Maya's Home Kitchen",
            type="Food & Beverage",
            location=MAYA["location"],
            activity=BusinessActivityEnum.HIGH,
            status=BusinessStatusEnum.ACTIVE,
        )
        db.add(maya_business)
        await db.flush()
        db.add(BusinessMember(business_id=maya_business.id, user_id=maya.id, role=BusinessMemberRoleEnum.OWNER))

        for t in MAYA_TRANSACTIONS:
            provider = providers[t["provider"]]
            db.add(
                Transaction(
                    business_id=maya_business.id,
                    provider_id=provider.id,
                    external_reference=t["reference"],
                    type=TransactionTypeEnum.INCOME if t["type"] == "income" else TransactionTypeEnum.EXPENSE,
                    source=TransactionSourceEnum.MANUAL if t["provider"] == "cash" else TransactionSourceEnum.PROVIDER_API,
                    category=t["category"],
                    amount=t["amount"],
                    currency="NPR",
                    status=TransactionStatusEnum.FLAGGED if t["status"] == "flagged" else TransactionStatusEnum.COMPLETED,
                    description=t["description"],
                    occurred_at=datetime.fromisoformat(t["timestamp"]).replace(tzinfo=timezone.utc),
                    transaction_metadata={"mode": "DEMO", "seed": "orbit_mobile_mock"},
                )
            )

        for g in MAYA_SAVINGS_GOALS:
            db.add(
                SavingsGoal(
                    user_id=maya.id,
                    name=g["name"],
                    target_amount=g["target"],
                    current_amount=g["current"],
                    monthly_contribution=g["monthly"],
                    target_date=g["completion"],
                    status=SavingsGoalStatusEnum.ACTIVE,
                )
            )

        # --- opportunities (global catalog, not user-specific) ---
        for f in FINANCING_OPTIONS:
            db.add(
                Opportunity(
                    kind=OpportunityKindEnum.FINANCING,
                    title=f["title"],
                    max_amount=f["max_amount"],
                    note=f["note"],
                    is_active=True,
                )
            )
        for ins in INSURANCE_OPTIONS:
            db.add(
                Opportunity(
                    kind=OpportunityKindEnum.INSURANCE,
                    title=ins["title"],
                    description=ins["description"],
                    estimated_premium=ins["estimated_premium"],
                    is_active=True,
                )
            )

        await db.commit()

        # --- compute Maya's real Financial Passport from what was just seeded ---
        await db.refresh(maya)
        passport = await passport_service.recompute_and_store(db, maya)

        typer.echo(f"Seeded {len(users) + 1} users, {len(businesses) + 1} businesses, 49 transactions, "
                    f"8 consents, 5 risk alerts, 7 audit events, 5 support tickets, 3 savings goals, 5 opportunities.")
        typer.echo(f"Maya Sharma user id: {maya.id}")
        typer.echo(f"Maya's Financial Activity Indicator score (computed): {passport.score}")


@app.command()
def main(reset: bool = typer.Option(False, "--reset", help="Delete existing seed data before reseeding.")) -> None:
    asyncio.run(_seed(reset))


if __name__ == "__main__":
    app()
