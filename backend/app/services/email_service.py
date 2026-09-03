"""SMTP email delivery. Currently only sends OTP codes; kept generic enough to
grow other transactional emails later."""
from __future__ import annotations

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from anyio import to_thread

from app.core.config import get_settings

settings = get_settings()


def _send_sync(to_email: str, subject: str, html_body: str) -> None:
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = settings.SMTP_USER
    msg["To"] = to_email
    msg.attach(MIMEText(html_body, "html"))

    with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
        server.starttls()
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        server.send_message(msg)


async def send_otp_email(to_email: str, code: str) -> None:
    """Blocking smtplib call, offloaded to a worker thread so it doesn't stall
    the event loop."""
    subject = "Your Orbit verification code"
    html_body = f"""
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
      <h2 style="color: #2563eb;">Orbit verification code</h2>
      <p>Use this code to continue. It expires in {settings.OTP_EXPIRE_MINUTES} minutes.</p>
      <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center;
                  background: #f4f4f5; padding: 16px; border-radius: 8px; margin: 20px 0;">
        {code}
      </div>
      <p style="color: #6b7280; font-size: 12px;">If you didn't request this, you can ignore this email.</p>
    </div>
    """
    await to_thread.run_sync(_send_sync, to_email, subject, html_body)
