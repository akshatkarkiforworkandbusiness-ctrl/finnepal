# Orbit — Fintech Mobile Prototype

A native Expo (React Native + TypeScript) prototype of Orbit, a financial operating layer for
Nepal-focused small businesses: collect and reconcile business transactions, connect a Tally
Prime accounting workflow, and build a consent-shareable Financial Profile. Frontend-only, with
local mock data — no backend, no real bank/Tally/eSewa/Khalti connections.

Note: `prompt.md` captures an earlier, superseded personal-finance-aggregator spec for this
project and is kept for history only — the current build follows the business-focused spec
described above.

## Running

```
npm install
npx expo start
```

Scan the QR code with the **Expo Go** app (iOS/Android), or press `a` / `i` for a simulator.

If you change `babel.config.js`, restart with `npx expo start -c` to clear the Metro cache.

## Project structure

- `App.tsx`, `index.ts` — app entry point
- `src/navigation` — React Navigation stack + 5-tab bottom nav (Home, Transactions, Insights,
  Financial Profile, More)
- `src/screens` — all screens, grouped by feature (Splash, Onboarding, Home, Money [transactions
  & reconciliation], Insights, FinancialProfile [incl. Tally], Connections, Security, Settings,
  Demo)
- `src/components` — shared UI (Button, Card, DonutChart, ReconciliationRow, SyncStatusCard,
  TransactionRow, etc.)
- `src/data` — mock data modules (business, transactions, accounts, categories, customers,
  Tally sync, consent requests, activity log) and mock provider adapters
- `src/services` — analytics, reconciliation, Tally and integration services — pure functions
  over mock data today, shaped so a future backend can slot in without UI changes
- `src/state` — app-wide state (onboarding flags, business, transactions, connections, consent,
  activity log) persisted to `AsyncStorage`
- `src/theme` — colors, spacing, typography (Deep Forest Green `#0B3D2E` / Deep Red `#C5161D`)

## web-reference/

An earlier Figma Make web (Vite/React) export kept for design reference only — not part of
the native app and not run by `npm start`.
