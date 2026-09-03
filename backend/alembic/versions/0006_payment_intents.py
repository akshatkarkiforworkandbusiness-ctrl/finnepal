"""real eSewa/Khalti payment collection

Revision ID: 0006
Revises: 0005
Create Date: 2026-09-01

Adds `payment_intents`: one row per real eSewa/Khalti checkout attempt
(distinct from the generic provider-connection adapters, which sync existing
transaction history — a capability those providers' public APIs don't
actually offer; payment collection is a different, real feature).
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = '0006'
down_revision: Union[str, None] = '0005'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'payment_intents',
        sa.Column('user_id', sa.UUID(), nullable=False),
        sa.Column('business_id', sa.UUID(), nullable=False),
        sa.Column('provider', sa.Enum('ESEWA', 'KHALTI', name='payment_provider_enum'), nullable=False),
        sa.Column('amount', sa.Numeric(precision=14, scale=2), nullable=False),
        sa.Column(
            'status',
            sa.Enum('PENDING', 'COMPLETED', 'FAILED', name='payment_intent_status_enum'),
            server_default='PENDING',
            nullable=False,
        ),
        sa.Column('provider_ref', sa.String(length=255), nullable=True),
        sa.Column('failure_reason', sa.String(length=500), nullable=True),
        sa.Column('transaction_id', sa.UUID(), nullable=True),
        sa.Column('id', sa.UUID(), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['business_id'], ['businesses.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['transaction_id'], ['transactions.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_payment_intents_provider_ref'), 'payment_intents', ['provider_ref'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_payment_intents_provider_ref'), table_name='payment_intents')
    op.drop_table('payment_intents')
