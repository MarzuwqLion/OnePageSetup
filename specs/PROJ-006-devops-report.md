# PROJ-006 DevOps Report — iPhone 17 Pro Max Cosmic Orange Landing Page

**Task ID:** PROJ-006
**Agent:** DevOps Engineer
**Date:** 2026-03-05
**Status:** Deployment Blocked — Authentication Required (Build Verified, All Checks Pass)

---

## Executive Summary

The production build, lint, and TypeScript checks all pass with zero errors. The Vercel CLI (v50.28.0) is available via `npx` but requires a one-time `vercel login` to authenticate before deployment can proceed. This is a manual gate — the user must run `vercel login` once, then deployment is a single command.

---

## Smoke Test Results

| Check | Command | Result | Exit Code |
|---|---|---|---|
| Production build | `npm run build` | PASS | 0 |
| ESLint | `npm run lint` | PASS — No warnings or errors | 0 |
| TypeScript | `npx tsc --noEmit` | PASS — No type errors | 0 |
| .next/ output | Directory contents | PASS — All expected files present | — |

### Build Output

```
Route (app)                                 Size  First Load JS
┌ ○ /                                    46.4 kB         149 kB
└ ○ /_not-found                            994 B         103 kB
+ First Load JS shared by all             102 kB

○  (Static)  prerendered as static content
```

The page compiles to fully static output — optimal for Vercel's Edge Network CDN.

---

## Deployment Attempt Log

### Option A — Vercel CLI (global)

```
$ vercel --version
bash: vercel: command not found
```

Result: Not installed globally.

### Option B — npx vercel

```
$ npx vercel --yes
Vercel CLI 50.28.0 installed via npx
Error: The specified token is not valid. Use `vercel login` to generate a new token.
```

Result: CLI available but no authenticated session exists in this environment. Deployment blocked at auth gate.

---

## Manual Deployment Instructions

Follow these steps exactly once from a terminal with internet access:

### Step 1: Authenticate with Vercel

```bash
npx vercel login
```

This opens a browser prompt. Log in with your Vercel account (GitHub, GitLab, email, or SSO). After login, a token is saved to `~/.local/share/com.vercel.cli/auth.json`.

### Step 2: Preview Deploy (recommended first)

```bash
cd "C:/Paradise/Sankofa/OnePageSite"
npx vercel --yes
```

- Accepts all defaults
- Creates a project called `iphone17-cosmic-orange` (or prompts you to name it)
- Returns a preview URL in the format: `https://iphone17-cosmic-orange-<hash>.vercel.app`

### Step 3: Production Deploy

After confirming the preview URL looks correct:

```bash
cd "C:/Paradise/Sankofa/OnePageSite"
npx vercel --prod --yes
```

Returns a production URL in the format: `https://iphone17-cosmic-orange.vercel.app`

### Step 4: Confirm Deployment

```bash
npx vercel ls
```

Lists all deployments with their status and URLs.

---

## vercel.json Security Headers Confirmation

The `vercel.json` at project root is configured and will be applied automatically on deploy:

| Header | Value | Status |
|---|---|---|
| X-Frame-Options | DENY | Configured |
| X-Content-Type-Options | nosniff | Configured |
| Referrer-Policy | strict-origin-when-cross-origin | Configured |
| Strict-Transport-Security | max-age=63072000; includeSubDomains; preload | Configured |
| Permissions-Policy | camera=(), microphone=(), geolocation=() | Configured |
| Content-Security-Policy | default-src 'self'; script-src 'self' 'unsafe-inline'; ... | Configured |
| Cache-Control (images) | public, max-age=31536000, immutable | Configured |

All headers from PROJ-005 security sign-off are in place.

---

## Monitoring Configuration

### Vercel Native (Zero Config — Enable in Dashboard)

After deploying, go to `https://vercel.com/dashboard` > select the project > **Analytics** tab:

1. **Vercel Analytics** (Real User Monitoring)
   - Enables Core Web Vitals tracking (LCP, FID, CLS, TTFB)
   - Enable toggle: Project Settings > Analytics > Enable
   - Free tier available

2. **Vercel Speed Insights**
   - Tracks performance scores per deployment
   - Enable toggle: Project Settings > Speed Insights > Enable

### Optional: Sentry Error Tracking

Install the Sentry SDK:

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

This wizard creates `sentry.client.config.ts`, `sentry.server.config.ts`, and `sentry.edge.config.ts`. Add your DSN to `.env`:

```
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
```

Basic Sentry initialization snippet (`sentry.client.config.ts`):

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  debug: false,
});
```

### Optional: Uptime Monitoring

Once the production URL is live, add it to one of:

- **Uptime Robot** (free): https://uptimerobot.com — HTTP monitor, 5-minute intervals
- **Better Uptime**: https://betteruptime.com — incident management + status page
- **Vercel native**: No uptime monitoring built-in; use external service

Recommended check interval: 5 minutes. Alert on 2 consecutive failures to avoid false positives.

---

## Rollback Procedure

### Via Vercel CLI

```bash
# List recent deployments
npx vercel ls

# Roll back to previous deployment
npx vercel rollback
```

### Via Vercel Dashboard

1. Go to `https://vercel.com/dashboard` > select project
2. Click **Deployments** tab
3. Find the last known-good deployment
4. Click the **...** menu > **Promote to Production**

Vercel keeps all deployments indefinitely (on free tier, up to 100 per project). Rollbacks are instant — no rebuild required.

---

## .next/ Build Artifacts Confirmed

The following output files are present after `npm run build`:

```
.next/
├── BUILD_ID
├── app-build-manifest.json
├── app-path-routes-manifest.json
├── build-manifest.json
├── cache/
├── prerender-manifest.json
├── routes-manifest.json
├── server/
├── static/
└── types/
```

All expected Next.js 15 static export artifacts are present and valid.

---

## Acceptance Criteria Status

| Criterion | Status | Notes |
|---|---|---|
| Deployment attempted via Vercel CLI | ATTEMPTED | Blocked by missing auth token |
| Build passes (zero errors) | PASS | Exit code 0 |
| Lint passes (zero errors) | PASS | Exit code 0, no warnings |
| TypeScript check passes | PASS | Exit code 0 |
| Preview URL captured | PENDING | Requires `vercel login` first |
| Manual deployment instructions documented | COMPLETE | Full step-by-step above |
| Monitoring setup documented | COMPLETE | Vercel Analytics, Speed Insights, Sentry, Uptime |
| Rollback procedure documented | COMPLETE | CLI and dashboard methods |
| Report written | COMPLETE | This file |

---

## Handoff to Project Manager

**Task ID:** PROJ-006
**Status:** Done (pending user auth action)
**Blocker:** User must run `vercel login` once from their terminal — this is a one-time manual step that cannot be automated in a headless environment without a pre-existing token.

**Next action for user:**
```bash
cd "C:/Paradise/Sankofa/OnePageSite"
npx vercel login
npx vercel --yes
```

The project is fully build-verified and deployment-ready. Once authenticated, the deploy will complete in under 60 seconds and return a live preview URL.

---

*Report generated by DevOps Engineer agent — PROJ-006*
