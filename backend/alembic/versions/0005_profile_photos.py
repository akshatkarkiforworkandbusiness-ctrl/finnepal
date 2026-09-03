"""admin/customer profile photos

Revision ID: 0005
Revises: 0004
Create Date: 2026-09-01

Adds `photo_url` to `users` and `admin_users`, populated via the Cloudinary
signed-upload flow (see app/services/upload_service.py) — never stores raw
image bytes, just the Cloudinary secure_url.
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = '0005'
down_revision: Union[str, None] = '0004'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('users', sa.Column('photo_url', sa.String(length=500), nullable=True))
    op.add_column('admin_users', sa.Column('photo_url', sa.String(length=500), nullable=True))


def downgrade() -> None:
    op.drop_column('admin_users', 'photo_url')
    op.drop_column('users', 'photo_url')
