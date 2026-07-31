# Deploying the Green Print frontend to Vercel

This folder is a standalone Vite + React app. It expects the backend to be
running somewhere else (e.g. Render) — see the separate `greenprint-backend`
zip for that.

## Steps

1. Push this folder to a GitHub repo (or push the whole `greenprint` project
   and set Vercel's "Root Directory" to `client`).
2. Go to **https://vercel.com/new** and import the repo.
3. Framework preset: Vercel should auto-detect **Vite**. If not, set:
   - Build command: `npm run build`
   - Output directory: `dist`
4. **Before deploying**, add an environment variable:
   - `VITE_API_URL` = `https://your-backend-name.onrender.com/api`
   (use your actual Render backend URL, deployed first — see the backend zip's README)
5. Deploy.

## Local development

```bash
npm install
npm run dev
```
This runs on `http://localhost:5173` and proxies `/api` calls to
`http://localhost:3000` automatically (see `vite.config.js`) — no
`VITE_API_URL` needed locally, just run the backend alongside it.

## Why VITE_API_URL matters

In production, this frontend (on Vercel) and the backend (on Render) are on
two different domains — there's no automatic proxy between them like there
is in local dev. `VITE_API_URL` tells the built app exactly where to send
API requests. It's baked into the JS bundle at build time, so:

- Set it in Vercel's **Project Settings → Environment Variables**
- Any time you change it, trigger a new deployment (redeploy) — it won't
  take effect on an old build

## SPA routing

`vercel.json` in this folder rewrites all routes to `index.html`, so
directly loading or refreshing a client-side route like `/logs` or
`/ai-insights` works correctly instead of 404ing.

## Automated smoke test (catches "deployed but actually broken")

`.github/workflows/smoke-test.yml` runs `scripts/smokeTest.js` against
your **real** deployed URL every 30 minutes (and any time you click "Run
workflow" in the Actions tab). It catches the class of bug unit/E2E tests
running locally can't: a bad `VITE_API_URL` baked into a specific
production build, Vercel's SPA rewrite silently not working, the favicon
missing, etc.

**One-time setup:**
1. Repo → **Settings → Secrets and variables → Actions → New repository secret**
2. Add `FRONTEND_URL` = your real Vercel URL (e.g. `https://greenprint.vercel.app`), no trailing slash

GitHub automatically emails the repo owner if a scheduled workflow run
fails — that's your alert, nothing extra to configure.

Run it locally any time with:
```bash
FRONTEND_URL=https://greenprint.vercel.app npm run smoke-test
```

