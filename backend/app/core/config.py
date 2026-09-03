"""Application configuration, loaded from environment variables / .env.

No secret ever gets a hardcoded default here — JWT_SECRET in particular must be
supplied by the environment (see .env.example / README for how to generate one).
"""
from __future__ import annotations

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    APP_ENV: str = "development"

    DATABASE_URL: str = "postgresql+asyncpg://orbit:orbit@db:5432/orbit"

    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # eSewa ePay v2. Two separate hosts in sandbox: the hosted checkout form
    # lives on rc-epay, the transaction-status API on rc (production drops
    # the "rc" — see PUBLIC_BASE_URL note re: switching to production).
    ESEWA_MODE: str = "sandbox"
    ESEWA_MERCHANT_ID: str | None = None
    ESEWA_SECRET_KEY: str | None = None
    ESEWA_FORM_URL: str = "https://rc-epay.esewa.com.np/api/epay/main/v2/form"
    ESEWA_STATUS_URL: str = "https://rc.esewa.com.np/api/epay/transaction/status/"

    # Khalti ePayment v2 — real payment-collection checkout (initiate, then
    # verify via lookup), not the account-history-sync shape the generic
    # provider-connection adapters use.
    KHALTI_INITIATE_URL: str = "https://dev.khalti.com/api/v2/epayment/initiate/"
    KHALTI_VERIFY_URL: str = "https://dev.khalti.com/api/v2/epayment/lookup/"
    KHALTI_PUBLIC_KEY: str | None = None
    KHALTI_SECRET_KEY: str | None = None

    # Backend's own externally-reachable base URL, used to build the
    # success/failure/return URLs eSewa/Khalti redirect back to after
    # checkout. Must be a real host in production (not localhost).
    PUBLIC_BASE_URL: str = "http://localhost:8000"

    CORS_ORIGINS: str = ""

    # SMTP, used to email one-time passcodes for customer register/login.
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str | None = None
    SMTP_PASSWORD: str | None = None

    OTP_LENGTH: int = 6
    OTP_EXPIRE_MINUTES: int = 10
    OTP_MAX_ATTEMPTS: int = 5

    # Groq (OpenAI-compatible) chat completions, used by the AI assistant.
    GROQ_API_KEY: str | None = None
    GROQ_MODEL: str = "openai/gpt-oss-120b"
    AI_RATE_LIMIT_PER_MINUTE: int = 10

    # Cloudinary: backend signs upload requests (secret never leaves the server);
    # admin/mobile upload directly to Cloudinary using the returned signature.
    CLOUDINARY_CLOUD_NAME: str | None = None
    CLOUDINARY_API_KEY: str | None = None
    CLOUDINARY_API_SECRET: str | None = None

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
