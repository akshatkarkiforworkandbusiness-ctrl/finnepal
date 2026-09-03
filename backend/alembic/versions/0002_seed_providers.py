"""seed provider catalog

Revision ID: 0002
Revises: 0001
Create Date: 2026-08-18

Seeds the 8-row provider catalog used by both frontends' actual mock
transaction data: esewa, khalti, bank_demo, fonepay, nabil, connectips,
stripe, cash. Values are transcribed verbatim from OrbitAdmin's
`providerHealth` array (uptime/successRate/category) merged with the mobile
prototype's `PROVIDERS` array (shortName/color/availability/description).
Runs automatically on every `alembic upgrade head` / `docker compose up`, and
is idempotent (guarded by ON CONFLICT DO NOTHING on the unique `code`).
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = '0002'
down_revision: Union[str, None] = '0001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

providers_table = sa.table(
    'providers',
    sa.column('code', sa.String),
    sa.column('name', sa.String),
    sa.column('short_name', sa.String),
    sa.column('category', sa.String),
    sa.column('availability', sa.String),
    sa.column('color', sa.String),
    sa.column('description', sa.String),
    sa.column('health_status', sa.String),
    sa.column('uptime', sa.Numeric),
    sa.column('success_rate', sa.Numeric),
)

SEED_ROWS = [
    dict(code='esewa', name='eSewa Business', short_name='eSewa', category='WALLET', availability='DEMO',
         color='#3B7D2B', description="Nepal's most used digital wallet.",
         health_status='HEALTHY', uptime=99.98, success_rate=99.6),
    dict(code='khalti', name='Khalti Business', short_name='Khalti', category='WALLET', availability='DEMO',
         color='#5C2D91', description='Digital wallet and payment gateway.',
         health_status='HEALTHY', uptime=99.95, success_rate=99.4),
    dict(code='bank_demo', name='Bank Demo', short_name='Bank Demo', category='BANK', availability='DEMO',
         color='#1B5E20', description='Sandbox bank-feed connection used for demos.',
         health_status='SANDBOX', uptime=99.2, success_rate=98.1),
    dict(code='fonepay', name='Fonepay / QR', short_name='Fonepay', category='PAYMENT', availability='PARTNER',
         color='#D4600A', description='QR-based payment network.',
         health_status='WARNING', uptime=97.4, success_rate=95.3),
    dict(code='nabil', name='Nabil Bank', short_name='Nabil', category='BANK', availability='DEMO',
         color='#B22222', description='Leading commercial bank in Nepal.',
         health_status='HEALTHY', uptime=99.5, success_rate=99.0),
    dict(code='connectips', name='connectIPS', short_name='cIPS', category='PAYMENT', availability='PARTNER',
         color='#0066A4', description='Interbank payment network.',
         health_status='SANDBOX', uptime=98.6, success_rate=97.2),
    dict(code='stripe', name='Stripe', short_name='Stripe', category='BUSINESS', availability='DEMO',
         color='#635BFF', description='For businesses receiving online/international payments.',
         health_status='HEALTHY', uptime=99.9, success_rate=99.7),
    dict(code='cash', name='Cash', short_name='Cash', category='CASH', availability='AVAILABLE',
         color='#0B3D2E', description='Track cash income and expenses manually.',
         health_status='HEALTHY', uptime=100.0, success_rate=100.0),
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
