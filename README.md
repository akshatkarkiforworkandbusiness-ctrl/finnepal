<p align="center">
  <img src="mobile/assets/logos/logo.png" alt="ORBIT logo" width="140" />
</p>

<h1 align="center">ORBIT</h1>

<p align="center">
  A financial operating layer for Nepal-focused small businesses — reconcile transactions,
  connect accounting/payment providers, and build a consent-shareable Financial Profile.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/backend-v0.1.0-3178C6" alt="backend version" />
  <img src="https://img.shields.io/badge/admin_console-v0.0.0-646CFF" alt="admin console version" />
  <img src="https://img.shields.io/badge/mobile_app-v1.0.0-000020" alt="mobile app version" />
  <img src="https://img.shields.io/badge/license-private-lightgrey" alt="license" />
</p>

### +3 Open Source Contribution
**New open-source library:** [**tally-bridge-py**](https://github.com/akshatkarkiforworkandbusiness-ctrl/tally-bridge-py) — clean Python utility to format eSewa/Khalti transactions into Tally Prime compliant `voucher.xml` + `master.xml` for Nepal's offline desktop installations. Extracted from [`backend/app/services/tally_service.py`](backend/app/services/tally_service.py) [29,30,335,337]. See usage: `from tally_bridge import generate_tally_voucher_xml` → balanced import payload.

---



## 🗂️ Monorepo layout

### 🐍 Backend — [`backend/`](backend)
FastAPI API — the canonical schema behind both the admin console and the mobile app.

### 🖥️ Admin web console — [`admin/`](admin)
React/Vite dashboard for admin operations (users, businesses, transactions, providers, risk, support).

### 📱 Mobile app — [`mobile/`](mobile)
Expo (React Native) customer-facing app.

## 🧰 Tech stack

**🐍 Backend — `backend/`** · `v0.1.0`
- Python 3.12, [FastAPI](https://fastapi.tiangolo.com/) + Uvicorn
- SQLAlchemy 2.0 (async) + PostgreSQL via `asyncpg`
- Alembic migrations
- Pydantic v2 / pydantic-settings
- JWT auth (`python-jose`) + Argon2 password hashing
- Pytest + pytest-asyncio

**🖥️ Admin web console — `admin/`** · `v0.0.0`
- React 18 + TypeScript, built with Vite
- Tailwind CSS + shadcn/ui (Radix primitives)
- TanStack Query, Redux Toolkit, Zustand
- Supabase client, Stripe.js, Chart.js/Recharts
- Package manager: pnpm

**📱 Mobile app — `mobile/`** · `v1.0.0`
- Expo (React Native) + TypeScript
- React Navigation (stack + bottom tabs)
- State persisted to `AsyncStorage`
- Frontend-only today, running on local mock data (no live backend wiring yet)

## ✅ Prerequisites

- [Node.js](https://nodejs.org/) 18+ and npm (mobile app)
- [pnpm](https://pnpm.io/installation) (admin console)
- [Python](https://www.python.org/downloads/) 3.12+ and pip (backend)
- PostgreSQL (backend database) — local install or a reachable instance
- [Expo Go](https://expo.dev/go) on your phone, or an iOS/Android simulator (mobile app)
- [Docker](https://docs.docker.com/get-docker/) + Docker Compose, if you'd rather run everything in containers (see below) instead of the native setup

## 🚀 Running each app

### 🐍 Backend (`backend/`)

**Linux / macOS**
```sh
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in DATABASE_URL / JWT_SECRET / SMTP_* / etc.
alembic upgrade head
uvicorn app.main:app --reload
```

**Windows (PowerShell)**
```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env   # fill in DATABASE_URL / JWT_SECRET / SMTP_* / etc.
alembic upgrade head
uvicorn app.main:app --reload
```

API docs are served at `http://localhost:8000/docs` once running.

### 🖥️ Admin web console (`admin/`)

Same commands on Linux, macOS, and Windows:
```sh
cd admin
pnpm install
pnpm approve-builds --all   # first run only, if pnpm blocks native postinstall scripts
pnpm run dev
```
Opens at `http://localhost:5173`.

### 📱 Mobile app (`mobile/`)

Same commands on Linux, macOS, and Windows:
```sh
cd mobile
npm install
npx expo start
```
Scan the QR code with the **Expo Go** app (iOS/Android), or press `a` / `i` to launch a simulator.
If you change `babel.config.js`, restart with `npx expo start -c` to clear the Metro cache.

## 🐳 Running everything with Docker Compose

An alternative to the per-app setup above: one command brings up Postgres, the backend API, the
admin console, and an Expo web preview of the mobile app, all networked together.

```sh
cp .env.example .env   # fill in JWT_SECRET / SMTP_* / etc.
docker compose up --build
```

- Backend API: `http://localhost:8000` (docs at `/docs`)
- Admin console: `http://localhost:5173`
- Mobile (Expo web preview): `http://localhost:8081`

Postgres data persists in a named volume across restarts. Run `docker compose down -v` to also
wipe the database. `alembic upgrade head` runs automatically on backend container start.

## 🔑 Environment variables

A workspace-wide [`.env.example`](.env.example) documents every variable used across the three
apps (database URL, JWT settings, SMTP credentials for OTP email, eSewa credentials, API base
URLs) — this is also the file `docker compose` reads. Each app also keeps its own `.env.example`
for running it natively outside Docker — copy it to `.env` and fill in real values.

**Note:** the backend loads `backend/.env`, not the root one — when running it natively (not via
Docker Compose), copy the same values into `backend/.env` too.

## 📜 Version log

### 🐍 Backend `v0.1.0`
- FastAPI service scaffolded: async SQLAlchemy 2.0 models, Alembic migrations, Pydantic v2 settings
- JWT authentication with Argon2 password hashing (admin) and email-OTP (customer)
- Pytest / pytest-asyncio test setup

### 🖥️ Admin console `v0.0.0`
- Vite + React 18 + TypeScript dashboard scaffolded
- Tailwind CSS + shadcn/ui component system
- Data layer wired with TanStack Query, Redux Toolkit, and Zustand
- Supabase client and Stripe.js integrated

### 📱 Mobile app `v1.0.0`
- Expo (React Native) + TypeScript app scaffolded
- Stack and bottom-tab navigation via React Navigation
- Local state persistence with `AsyncStorage`
- Running on local mock data — no live backend wiring yet
