"""Creates the initial SUPER_ADMIN account. Idempotent — a no-op if the email
already exists. Password is either supplied (--password / ADMIN_PASSWORD env,
e.g. for docker-compose seeding) or freshly random-generated and printed once
to stdout; never bundled inside seed_demo_data.py.

Usage: python -m app.scripts.create_admin [--email ...] [--name ...] [--password ...]
"""
from __future__ import annotations

import asyncio

import typer

from app.core.database import AsyncSessionLocal
from app.core.security import generate_random_password, hash_password
from app.models.admin import AdminUser
from app.models.enums import AdminRoleEnum
from app.repositories.admin_repository import AdminUserRepository

app = typer.Typer(add_completion=False)

DEFAULT_EMAIL = "admin@orbit.local"
DEFAULT_NAME = "Orbit Super Admin"


async def _create_admin(email: str, name: str, password: str | None) -> None:
    async with AsyncSessionLocal() as db:
        repo = AdminUserRepository(db)
        existing = await repo.get_by_email(email)
        if existing is not None:
            typer.echo(f"Admin '{email}' already exists (id={existing.id}). Not creating a duplicate.")
            return

        raw_password = password or generate_random_password()
        admin = AdminUser(
            name=name,
            email=email,
            password_hash=hash_password(raw_password),
            role=AdminRoleEnum.SUPER_ADMIN,
            is_active=True,
        )
        repo.add(admin)
        await db.commit()
        await db.refresh(admin)

        typer.echo("Admin account created:")
        typer.echo(f"  email:    {admin.email}")
        if password is None:
            typer.echo(f"  password: {raw_password}")
            typer.echo("Store this password now — it is never shown again and is not logged anywhere.")
        else:
            typer.echo("  password: (as supplied via --password / ADMIN_PASSWORD)")


@app.command()
def main(
    email: str = typer.Option(DEFAULT_EMAIL, envvar="ADMIN_EMAIL"),
    name: str = typer.Option(DEFAULT_NAME, envvar="ADMIN_NAME"),
    password: str | None = typer.Option(None, envvar="ADMIN_PASSWORD", help="Fixed password. Random + printed if omitted."),
) -> None:
    asyncio.run(_create_admin(email, name, password))


if __name__ == "__main__":
    app()
