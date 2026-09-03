"""OrbitBackend FastAPI application entrypoint."""
from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends

from app.core.config import get_settings
from app.core.database import get_db

settings = get_settings()

app = FastAPI(
    title="OrbitBackend",
    description=(
        "API-first backend for the Orbit fintech platform: reconciles the OrbitAdmin console and the "
        "ORBIT mobile prototype onto one canonical schema. Provides admin operations (users, businesses, "
        "transactions, providers, connections, consents, risk, support, audit) and customer-facing "
        "endpoints (businesses, transactions, provider connections, Financial Activity Indicators, "
        "savings goals, and informational financing/insurance opportunities). All provider credentials "
        "stay server-side; demo provider data is always explicitly tagged mode=DEMO."
    ),
    version="0.1.0",
)

if settings.cors_origins_list:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


@app.get("/health", tags=["health"], summary="Simple liveness check", description="Used by the Docker healthcheck; does not touch the database.")
async def simple_health() -> dict:
    return {"status": "ok"}


from app.api.v1 import admin as admin_router  # noqa: E402
from app.api.v1 import ai as ai_router  # noqa: E402
from app.api.v1 import auth as auth_router  # noqa: E402
from app.api.v1 import businesses as businesses_router  # noqa: E402
from app.api.v1 import connections as connections_router  # noqa: E402
from app.api.v1 import consents as consents_router  # noqa: E402
from app.api.v1 import health as v1_health_router  # noqa: E402
from app.api.v1 import opportunities as opportunities_router  # noqa: E402
from app.api.v1 import passport as passport_router  # noqa: E402
from app.api.v1 import payments as payments_router  # noqa: E402
from app.api.v1 import providers as providers_router  # noqa: E402
from app.api.v1 import savings as savings_router  # noqa: E402
from app.api.v1 import transactions as transactions_router  # noqa: E402
from app.api.v1 import uploads as uploads_router  # noqa: E402
from app.api.v1 import users as users_router  # noqa: E402

API_PREFIX = "/api/v1"

app.include_router(auth_router.router, prefix=API_PREFIX, tags=["auth"])
app.include_router(v1_health_router.router, prefix=API_PREFIX, tags=["health"])
app.include_router(users_router.router, prefix=API_PREFIX, tags=["users"])
app.include_router(businesses_router.router, prefix=API_PREFIX, tags=["businesses"])
app.include_router(transactions_router.router, prefix=API_PREFIX, tags=["transactions"])
app.include_router(providers_router.router, prefix=API_PREFIX, tags=["providers"])
app.include_router(connections_router.router, prefix=API_PREFIX, tags=["connections"])
app.include_router(consents_router.router, prefix=API_PREFIX, tags=["consents"])
app.include_router(passport_router.router, prefix=API_PREFIX, tags=["passport"])
app.include_router(savings_router.router, prefix=API_PREFIX, tags=["savings"])
app.include_router(opportunities_router.router, prefix=API_PREFIX, tags=["opportunities"])
app.include_router(admin_router.router, prefix=API_PREFIX, tags=["admin"])
app.include_router(ai_router.router, prefix=API_PREFIX, tags=["ai"])
app.include_router(uploads_router.router, prefix=API_PREFIX, tags=["uploads"])
app.include_router(payments_router.router, prefix=API_PREFIX, tags=["payments"])
