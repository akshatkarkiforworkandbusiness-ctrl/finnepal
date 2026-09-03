"""seed additional bank providers

Revision ID: 0007
Revises: 0006
Create Date: 2026-09-01

The mobile app's bank picker (BANK_CONNECTION_PROVIDER_IDS) offers nicasia,
gibl (Global IME), kumari, and standardchartered alongside nabil/esewa/khalti
— but only nabil/esewa/khalti were ever seeded in the real provider catalog,
so connecting any of the other four 404'd against the real backend (silently,
since the mobile client best-effort-swallows that and falls back to the
local-only mock connection). Seeding them for real closes that gap.
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = '0007'
down_revision: Union[str, None] = '0006'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

SEED_ROWS = [
    dict(code='nicasia', name='NIC Asia Bank', short_name='NIC Asia', category='BANK', availability='DEMO',
         color='#004B87', description='Commercial bank partner.',
         health_status='HEALTHY', uptime=99.3, success_rate=98.7),
    dict(code='gibl', name='Global IME Bank', short_name='Global IME', category='BANK', availability='DEMO',
         color='#D4600A', description='Full-service commercial bank.',
         health_status='HEALTHY', uptime=99.1, success_rate=98.4),
    dict(code='kumari', name='Kumari Bank', short_name='Kumari', category='BANK', availability='AVAILABLE',
         color='#8E1B3C', description='Commercial bank partner.',
         health_status='SANDBOX', uptime=98.8, success_rate=97.9),
    dict(code='standardchartered', name='Standard Chartered', short_name='SCB', category='BANK', availability='AVAILABLE',
         color='#006A9C', description='International commercial bank.',
         health_status='SANDBOX', uptime=99.0, success_rate=98.2),
]


def upgrade() -> None:
    conn = op.get_bind()
    for row in SEED_ROWS:
        conn.execute(
            sa.text(
                """
                INSERT INTO providers (code, name, short_name, category, availability, color, description, health_status, uptime, success_rate)
                VALUES (:code, :name, :short_name, :category, :availability, :color, :description, :health_status, :uptime, :success_rate)
                ON CONFLICT (code) DO NOTHING
                """
            ),
            row,
        )


def downgrade() -> None:
    conn = op.get_bind()
    codes = [row['code'] for row in SEED_ROWS]
    conn.execute(sa.text("DELETE FROM providers WHERE code = ANY(:codes)"), {"codes": codes})
