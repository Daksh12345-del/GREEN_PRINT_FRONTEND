// smoke-test.js
// Runs against a REAL deployed frontend (Vercel), not localhost — catches
// things unit/E2E tests running locally can't: a bad VITE_API_URL baked
// into the production build, Vercel's SPA rewrite misconfigured, the
// favicon not deploying, etc.
//
// Usage:
//   FRONTEND_URL=https://greenprint.vercel.app node scripts/smoke-test.js

const FRONTEND_URL = process.env.FRONTEND_URL;

if (!FRONTEND_URL) {
  console.error("FRONTEND_URL environment variable is required, e.g.:");
  console.error("  FRONTEND_URL=https://greenprint.vercel.app node scripts/smoke-test.js");
  process.exit(1);
}

let failures = 0;

function check(label, condition, detail) {
  if (condition) {
    console.log(`✅ ${label}`);
  } else {
    console.log(`❌ ${label}${detail ? ` — ${detail}` : ""}`);
    failures++;
  }
}

async function fetchText(path) {
  const res = await fetch(`${FRONTEND_URL}${path}`, { signal: AbortSignal.timeout(30000) });
  const body = await res.text();
  return { status: res.status, body };
}

async function main() {
  console.log(`Running smoke test against ${FRONTEND_URL}\n`);

  // 1. The homepage loads and is actually the Green Print app, not a
  // blank page, a 404, or someone else's default landing page.
  try {
    const { status, body } = await fetchText("/");
    check("Homepage returns HTTP 200", status === 200, `got HTTP ${status}`);
    check("Homepage contains the app title", body.includes("Green Print"));
    check("Homepage references the built JS bundle", /<script[^>]+src="[^"]+\.js"/.test(body));
  } catch (err) {
    check("Homepage loads", false, err.message);
  }

  // 2. A client-side route loads directly (not just via in-app
  // navigation) — this is exactly what breaks if Vercel's SPA rewrite
  // (vercel.json) isn't deployed correctly, and is invisible if you only
  // ever click around inside the app instead of refreshing/deep-linking.
  try {
    const { status, body } = await fetchText("/login");
    check("Direct-loading /login works (SPA rewrite is correct)", status === 200, `got HTTP ${status}`);
    check("/login serves the app, not a 404 page", body.includes("Green Print"));
  } catch (err) {
    check("Direct-loading /login works (SPA rewrite is correct)", false, err.message);
  }

  // 3. The favicon actually deployed (easy to silently miss since it's
  // just a <link> tag — nothing in the UI visibly breaks if it 404s).
  try {
    const res = await fetch(`${FRONTEND_URL}/favicon.svg`, { signal: AbortSignal.timeout(15000) });
    check("Favicon is served", res.status === 200, `got HTTP ${res.status}`);
  } catch (err) {
    check("Favicon is served", false, err.message);
  }

  console.log("");
  if (failures > 0) {
    console.log(`${failures} check(s) FAILED.`);
    process.exit(1);
  } else {
    console.log("All smoke test checks passed.");
    process.exit(0);
  }
}

main().catch((err) => {
  console.error("Smoke test crashed:", err);
  process.exit(1);
});
