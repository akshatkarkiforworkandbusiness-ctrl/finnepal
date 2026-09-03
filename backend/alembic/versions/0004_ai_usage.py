"""AI assistant usage tracking

Revision ID: 0004
Revises: 0003
Create Date: 2026-09-01

Adds `ai_usage_logs` (one row per Orbit AI / Groq call, backing both the
per-user rate limit and the admin usage dashboard) and the AI_USAGE_VIEWED
audit action.
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = '0004'
down_revision: Union[str, None] = '0003'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("ALTER TYPE audit_action_enum ADD VALUE IF NOT EXISTS 'AI_USAGE_VIEWED'")

    op.create_table(
        'ai_usage_logs',
        sa.Column('user_id', sa.UUID(), nullable=False),
        sa.Column('business_id', sa.UUID(), nullable=True),
        sa.Column('model', sa.String(length=100), nullable=False),
        sa.Column('prompt', sa.Text(), nullable=False),
        sa.Column('response', sa.Text(), nullable=False),
        sa.Column('prompt_tokens', sa.Integer(), server_default='0', nullable=False),
        sa.Column('completion_tokens', sa.Integer(), server_default='0', nullable=False),
        sa.Column('total_tokens', sa.Integer(), server_default='0', nullable=False),
        sa.Column('id', sa.UUID(), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['business_id'], ['businesses.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_ai_usage_logs_user_id'), 'ai_usage_logs', ['user_id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_ai_usage_logs_user_id'), table_name='ai_usage_logs')
    op.drop_table('ai_usage_logs')
    # Postgres doesn't support removing an enum value; downgrade leaves AI_USAGE_VIEWED in place.
