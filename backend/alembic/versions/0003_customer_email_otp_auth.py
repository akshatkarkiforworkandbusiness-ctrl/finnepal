"""customer email-OTP auth

Revision ID: 0003
Revises: 0002
Create Date: 2026-09-01

Adds the two tables backing customer (mobile) email-OTP login/register:
`user_otp_codes` (hashed, short-lived codes emailed via SMTP) and
`user_refresh_tokens` (rotating refresh tokens, same design as
`admin_refresh_tokens`). No changes to `users` — it already has the
PENDING/ACTIVE status values a registering account moves through.
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = '0003'
down_revision: Union[str, None] = '0002'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'user_otp_codes',
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('code_hash', sa.String(length=64), nullable=False),
        sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('consumed_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('attempts', sa.Integer(), server_default='0', nullable=False),
        sa.Column('id', sa.UUID(), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_user_otp_codes_email'), 'user_otp_codes', ['email'], unique=False)

    op.create_table(
        'user_refresh_tokens',
        sa.Column('user_id', sa.UUID(), nullable=False),
        sa.Column('token_hash', sa.String(length=64), nullable=False),
        sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('revoked_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('replaced_by_id', sa.UUID(), nullable=True),
        sa.Column('id', sa.UUID(), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['replaced_by_id'], ['user_refresh_tokens.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_user_refresh_tokens_token_hash'), 'user_refresh_tokens', ['token_hash'], unique=True)


def downgrade() -> None:
    op.drop_index(op.f('ix_user_refresh_tokens_token_hash'), table_name='user_refresh_tokens')
    op.drop_table('user_refresh_tokens')
    op.drop_index(op.f('ix_user_otp_codes_email'), table_name='user_otp_codes')
    op.drop_table('user_otp_codes')
