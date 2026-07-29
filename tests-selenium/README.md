# Green Print — Selenium E2E tests

Real browser tests against the actual running app (built frontend +
real backend + real Postgres) — no mocked API responses.

## Running locally

You need three things running at once:

1. **Backend** (from the `greenprint-backend` repo):
   ```bash
   cd server
   npm install
   npm start   # http://localhost:3000
   ```

2. **Frontend**, built and served as static files (not `npm run dev` —
   these tests expect a production-like build):
   ```bash
   cd client
   VITE_API_URL=http://localhost:3000/api npm run build
   npx serve -s dist -l 5000   # http://localhost:5000
   ```

3. **This test suite**:
   ```bash
   cd tests-selenium
   pip install -r requirements.txt
   pytest -v
   ```

Chrome (or Chromium) must be installed on your machine — Selenium 4.6+
auto-manages the matching chromedriver for you, no manual setup needed.

## Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `BASE_URL` | `http://localhost:5000` | Where the built frontend is being served |
| `SELENIUM_TIMEOUT` | `10` | Seconds to wait for elements before failing |

## What's covered

- `test_login.py` — login, wrong-password handling, registration, sign-out
- `test_dashboard.py` — KPI cards render, logging activity updates the
  dashboard total, AI Insights returns something (live or fallback)
- `test_responsive.py` — the mobile hamburger menu: hidden by default,
  opens the drawer, closes via backdrop tap or picking a nav link

Every test that needs to be logged in registers its own brand-new
company through the real UI first (see `new_company` / `new_company_mobile`
fixtures in `conftest.py`) — nothing depends on specific seeded demo data
existing, so tests stay independent and repeatable.

## CI

See `.github/workflows/e2e.yml` in the repo root — it spins up a real
Postgres service container, checks out and starts the backend (from a
sibling repo checkout), builds and serves this frontend, then runs this
whole suite against them with headless Chrome (preinstalled on GitHub's
`ubuntu-latest` runners).
