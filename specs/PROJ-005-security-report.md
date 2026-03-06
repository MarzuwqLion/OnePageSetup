# Security Review Report: iPhone 17 Pro Max — Cosmic Orange Landing Page

**Task ID:** PROJ-005
**Status:** Done
**Author:** Security Reviewer
**Date:** 2026-03-05
**Reviewed By:** Project Manager
**Input Artifacts:** PROJ-001 (Architecture), PROJ-003 (Engineer Output), full codebase audit

---

## Overall Security Status: PASS-WITH-ISSUES

The application passes all deployment-blocking security gates. Two medium-severity and two low-severity findings are documented below. No CRITICAL or HIGH findings were identified. Deployment is approved with recommendations for near-term remediation of the MEDIUM findings.

---

## Executive Summary

| Severity | Count | Deployment Blocker |
|---|---|---|
| CRITICAL | 0 | N/A |
| HIGH | 0 | N/A |
| MEDIUM | 2 | No |
| LOW | 2 | No |
| INFO | 1 | No |

**Risk Assessment:** This is a zero-API, zero-auth, zero-user-input static marketing page. The attack surface is minimal. All critical threat model items from PROJ-001 Section 6 are properly implemented. The findings below are defense-in-depth improvements rather than active vulnerabilities.

---

## Architecture Compliance Check (PROJ-001 Section 6)

| Requirement | Status | Evidence |
|---|---|---|
| FAL_API_KEY never in client bundle | PASS | No `NEXT_PUBLIC_FAL_API_KEY` anywhere in `*.tsx`/`*.ts` source files. Grep confirmed zero matches. |
| FAL_API_KEY not hardcoded in source | PASS | No literal key values found. Only placeholder in `.env.example`. |
| `.env` excluded from git | PASS | `.gitignore` line 27: `.env` explicitly excluded. Also covers `.env*.local`, `.env.development`, `.env.production`. |
| `.env.example` committed with placeholder | PASS | `FAL_API_KEY=your_fal_api_key_here` — correct placeholder, no real key. Comment confirms never prefix with `NEXT_PUBLIC_`. |
| HTTPS enforced via HSTS | PASS | `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` in both `next.config.ts` and `vercel.json`. |
| No `dangerouslySetInnerHTML` | PASS | Zero occurrences across all 8 component files. |
| No `eval()` | PASS | Zero occurrences in any source file. |
| No unvalidated redirects | PASS | No `window.location.href =` or `window.open()` calls. All links are anchor hrefs to in-page fragment IDs (`#pricing`, `#features`, etc.). |

---

## Security Headers Validation

### Source: `next.config.ts` (application layer)

| Header | Value | Status | Notes |
|---|---|---|---|
| `X-Frame-Options` | `DENY` | PASS | Clickjacking protection confirmed. |
| `X-Content-Type-Options` | `nosniff` | PASS | MIME-sniffing protection confirmed. |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | PASS | Conservative referrer policy. |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | PASS | 2-year HSTS with preload list eligibility. |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | PASS | Appropriate for a marketing page. |
| `Content-Security-Policy` | See below | PASS-WITH-ISSUES | See SECURITY-001. |

### Source: `vercel.json` (edge layer)

All five non-CSP headers are duplicated in `vercel.json`, matching `next.config.ts` exactly. This belt-and-suspenders approach is correct — edge headers fire before the Next.js runtime. **The CSP header IS present in `vercel.json` and matches `next.config.ts`.** Both layers are fully aligned.

### CSP Deep Analysis

**Actual CSP (both `next.config.ts` and `vercel.json`):**
```
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https://fal.media https://v3b.fal.media https://*.vercel.app;
font-src 'self';
connect-src 'self';
frame-ancestors 'none';
base-uri 'self';
form-action 'self'
```

| CSP Directive | Required Value | Actual Value | Status |
|---|---|---|---|
| `default-src` | `'self'` | `'self'` | PASS |
| `img-src` includes `v3b.fal.media` | Required | `https://v3b.fal.media` | PASS |
| `img-src` includes `fal.media` | Required | `https://fal.media` | PASS |
| `frame-ancestors` | `'none'` | `'none'` | PASS |
| `script-src` no `unsafe-eval` | Required | Not present — only `unsafe-inline` | PASS |
| `base-uri` | `'self'` | `'self'` | PASS |
| `form-action` | `'self'` | `'self'` | PASS |

**Note on `unsafe-inline`:** As documented in PROJ-001 Section 6, `unsafe-inline` on `script-src` and `style-src` is required for Next.js inline script injection and Framer Motion inline transforms. This is a known architectural constraint for static Next.js builds without middleware-based nonce injection. It is accepted risk with documented rationale.

---

## Detailed Findings

### SECURITY-001 — MEDIUM: `unsafe-inline` in `script-src` reduces XSS mitigation effectiveness

**Severity:** MEDIUM
**Likelihood:** LOW (no user-generated content, no dynamic script injection)
**CVSS v3 Estimate:** 4.3 (AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:N/A:N)
**OWASP Category:** A05:2021 — Security Misconfiguration

**Description:**
The CSP `script-src 'self' 'unsafe-inline'` directive allows inline script execution. While necessary for the current static Next.js build architecture, this significantly weakens CSP's ability to prevent XSS if an injection vector were introduced in the future. A nonce- or hash-based CSP would eliminate this weakness.

**Current risk context:** This page has no user input forms, no comment systems, no third-party ad scripts, and no server-side rendering with user-controlled data. The practical XSS risk today is negligible. However, the policy would not block a hypothetical future inline script injection.

**Affected files:**
- `C:/Paradise/Sankofa/OnePageSite/next.config.ts` (line 19)
- `C:/Paradise/Sankofa/OnePageSite/vercel.json` (line 19)

**Recommendation (not a deployment blocker):**
Evaluate migrating to a nonce-based CSP using Next.js middleware in a future iteration. This would require adding `middleware.ts` to inject a per-request nonce and passing it to all inline scripts/styles. Not compatible with pure static export, but compatible with Vercel-hosted SSG.

**Accepted Risk:** Yes — documented in PROJ-001 Section 6. Architectural constraint of static Next.js build. Revisit if the page evolves to include user-generated content or third-party script embeds.

---

### SECURITY-002 — MEDIUM: Open Graph image URL uses external CDN hardcoded in `app/layout.tsx`

**Severity:** MEDIUM
**Likelihood:** LOW
**OWASP Category:** A05:2021 — Security Misconfiguration

**Description:**
`app/layout.tsx` (lines 24–29) hardcodes a specific `v3b.fal.media` URL as the Open Graph image:
```
https://v3b.fal.media/files/b/0a9100d1/MnGOHaGHyy4NoaNJpcvsy_XogwTTki.png
```
This URL is also referenced in the Twitter card metadata (line 38). Two concerns:

1. **URL stability:** FAL AI CDN URLs at `v3b.fal.media` are generated paths. If the FAL CDN reorganizes or the file is evicted, the OG image breaks silently — social media previews will display no image.
2. **No integrity check:** The image is fetched directly by social media crawlers from an external CDN. If the FAL CDN were compromised and the image replaced, the OG image content could be altered without any code change.

**Affected files:**
- `C:/Paradise/Sankofa/OnePageSite/app/layout.tsx` (lines 24–29, 37–39)

**Recommendation:**
Copy the OG image to `public/og-image.png` and reference it as `/og-image.png` (self-hosted). This eliminates the external dependency for metadata. The `next/image` optimization pipeline is not used for OG images (social crawlers fetch the raw URL), so serving from `/public` is appropriate.

**Accepted Risk:** Partially — the current external URL works and the FAL CDN is the authoritative source for generated assets. This is a maintenance risk rather than a security vulnerability. Should be resolved before the next major content update.

---

### SECURITY-003 — LOW: `FeaturesSection.tsx`, `ColorStorySection.tsx`, `PricingCTASection.tsx` are marked `'use client'` without strict necessity

**Severity:** LOW
**OWASP Category:** A05:2021 — Security Misconfiguration (principle of least privilege, minimal client surface)

**Description:**
`FeaturesSection.tsx`, `ColorStorySection.tsx`, and `PricingCTASection.tsx` are all declared `'use client'` (lines 1 of each file). This causes their full component trees — including all static content — to be included in the client-side JavaScript bundle and executed in the browser.

From a security perspective, this widens the client-side code surface area unnecessarily. More client JS means more code subject to browser-based attacks, and a larger bundle is harder to audit for injection vulnerabilities over time. The PROJ-001 architecture spec designates these as RSC (React Server Components), and only `PricingSelector.tsx`, `Navbar.tsx`, and `StickyMobileCTA.tsx` require client-side state.

**Affected files:**
- `C:/Paradise/Sankofa/OnePageSite/components/FeaturesSection.tsx` (line 1)
- `C:/Paradise/Sankofa/OnePageSite/components/ColorStorySection.tsx` (line 1)
- `C:/Paradise/Sankofa/OnePageSite/components/PricingCTASection.tsx` (line 1)

**Recommendation:**
Remove `'use client'` from these components and refactor to use `dynamic()` import with `{ ssr: false }` for Framer Motion as described in PROJ-001 Section 5. This aligns implementation with the architecture spec and reduces client bundle size and attack surface. This is a QA/Engineer finding as well (architecture drift).

**Accepted Risk:** Low — Framer Motion's `useReducedMotion()` hook requires a client context. The current implementation is functional. Flag for PROJ-006 (post-launch cleanup sprint).

---

### SECURITY-004 — LOW: `PricingCTASection.tsx` "Buy Now" button uses `href="#"` (non-functional anchor)

**Severity:** LOW
**OWASP Category:** A07:2021 — Identification and Authentication Failures (not applicable) / Noted as UX security concern

**Description:**
`PricingCTASection.tsx` (line 41) has:
```tsx
<a href="#" ...>Buy Now</a>
```
Using `href="#"` causes the page to scroll to the top on click, which is unexpected behavior. More relevantly, a placeholder `#` anchor on a CTA button indicates that purchase functionality is not yet implemented. If this page were deployed publicly, users would click "Buy Now" with no action — a user trust and integrity concern.

This is not a technical security vulnerability but is noted because deceptive or non-functional purchase CTAs can attract regulatory scrutiny (FTC guidelines on dark patterns) and undermine trust.

**Affected files:**
- `C:/Paradise/Sankofa/OnePageSite/components/PricingCTASection.tsx` (line 41)

**Recommendation:**
Replace `href="#"` with either a real purchase URL or a clear "Coming Soon" / "Notify Me" indicator before public launch.

---

### SECURITY-005 — INFO: Architecture spec (`PROJ-001`) CSP `img-src` omits `v3b.fal.media`; implementation correctly adds it

**Severity:** INFO (no action required)

**Description:**
The architecture spec (PROJ-001 Section 6) defines the CSP `img-src` as:
```
img-src 'self' data: https://fal.media https://*.vercel.app
```
This omits `https://v3b.fal.media`. The implementation in `next.config.ts` and `vercel.json` correctly adds `https://v3b.fal.media` since all product images are served from that subdomain. This is a spec-vs-implementation divergence where the implementation is *more secure and correct* than the spec.

**No action required.** The engineer made the right call. Recommend updating PROJ-001 Section 6 to reflect the correct `img-src` directive with `v3b.fal.media` included. This is a documentation issue only.

---

## XSS Risk Assessment

| Check | Result |
|---|---|
| `dangerouslySetInnerHTML` present | NOT FOUND — all 8 components audited |
| `innerHTML` assignment | NOT FOUND |
| `eval()` | NOT FOUND |
| `document.write()` | NOT FOUND |
| User-controlled data rendered | NOT APPLICABLE — no user input anywhere on the page |
| External data rendered without sanitization | NOT APPLICABLE — all content is compile-time static TypeScript constants in `lib/content.ts` |
| Third-party scripts loaded | NOT FOUND — no `<Script>` tags, no analytics, no ad networks |

**XSS risk: NEGLIGIBLE.** This page has no user input surface, no external data injection, and no dynamic HTML construction.

---

## Secret Exposure Assessment

| Check | Result |
|---|---|
| `FAL_API_KEY` hardcoded in any `.ts`/`.tsx` file | NOT FOUND |
| `NEXT_PUBLIC_FAL_API_KEY` anywhere | NOT FOUND |
| `.env` in `.gitignore` | CONFIRMED — line 27 |
| `.env*.local` in `.gitignore` | CONFIRMED — line 28 |
| `.env.development` in `.gitignore` | CONFIRMED — line 29 |
| `.env.production` in `.gitignore` | CONFIRMED — line 30 |
| `.env.example` contains real key | NOT FOUND — only placeholder `your_fal_api_key_here` |
| `scripts/fetch-images.ts` present | NOT PRESENT — directory is empty; images are served from external CDN URLs directly embedded in `lib/content.ts` |

**Note on image architecture:** The implemented approach differs slightly from PROJ-001 Section 4 (which described a build-time fetch script). Instead, FAL AI CDN URLs are embedded directly in `lib/content.ts` as static strings. No build-time script was created. This means `FAL_API_KEY` is never called at build time in the current implementation — the key is not used at all in this codebase. This is actually a simpler and safer approach: zero API calls, zero secret usage at any phase. The `.env.example` and `.gitignore` entries remain appropriate for future use.

---

## Dependency Review

**Source:** `package.json`

| Package | Version Spec | Assessment |
|---|---|---|
| `next` | `^15.0.0` | ACCEPTABLE — stable release channel. Next.js 15 is production-ready as of audit date. |
| `react` | `^18.3.0` | ACCEPTABLE — current stable React. |
| `react-dom` | `^18.3.0` | ACCEPTABLE — matches React version. |
| `framer-motion` | `^11.0.0` | ACCEPTABLE — stable release. No known CVEs at audit date. |
| `typescript` | `^5.4.0` | ACCEPTABLE — current stable TypeScript. |
| `tailwindcss` | `^3.4.0` | ACCEPTABLE — stable release, build-time only, no runtime exposure. |
| `eslint` | `^8.0.0` | ACCEPTABLE — enforces code quality. Note: ESLint 9 is available; upgrade is not urgent. |
| `autoprefixer` | `^10.4.0` | ACCEPTABLE — build-time only. |
| `postcss` | `^8.4.0` | ACCEPTABLE — build-time only. |

**Overall dependency posture: LOW RISK.** Small, well-maintained dependency set. All packages are production releases (no `-beta`, `-rc`, `-alpha` suffixes). No exotic or abandoned packages. No server-side dependencies that could introduce injection vulnerabilities.

**Recommendation:** Enable Dependabot alerts on the GitHub repository as specified in PROJ-001 Section 6. Run `npm audit` in CI to catch future CVEs automatically.

---

## Open Graph / Metadata Assessment

`app/layout.tsx` metadata analysis:

| Check | Result |
|---|---|
| External URLs in OG images | YES — `v3b.fal.media` URL (see SECURITY-002) |
| User-controlled OG data | NO — all metadata is hardcoded static strings |
| `robots` meta | `index: true, follow: true` — appropriate for a marketing page |
| `lang` attribute on `<html>` | PRESENT — `lang="en"` (accessibility + content security) |
| No external script tags in layout | CONFIRMED |
| No `<link rel="preconnect">` to unknown origins | CONFIRMED |

---

## OWASP Top 10 Applicability Matrix (Static Marketing Page)

| OWASP 2021 | Applicable | Finding |
|---|---|---|
| A01 — Broken Access Control | NO | No access control; fully public page |
| A02 — Cryptographic Failures | PARTIAL | HSTS enforces HTTPS. No data at rest. PASS. |
| A03 — Injection | PARTIAL | No user input, no SQL/NoSQL, no template engine. XSS risk assessed. PASS. |
| A04 — Insecure Design | PARTIAL | Architecture reviewed. No insecure design patterns found. PASS. |
| A05 — Security Misconfiguration | YES | SECURITY-001 (unsafe-inline), SECURITY-003 (unnecessary use client). MEDIUM/LOW. |
| A06 — Vulnerable and Outdated Components | PARTIAL | Dependencies reviewed. No known CVEs. PASS. |
| A07 — Auth Failures | NO | No authentication present. |
| A08 — Software & Data Integrity Failures | PARTIAL | SECURITY-002 (external OG image URL). MEDIUM. |
| A09 — Security Logging & Monitoring | NO | Static CDN page; Vercel provides edge logs. |
| A10 — SSRF | NO | No server-side requests at runtime. |

---

## Risk Acceptance

The following findings are accepted for initial production deployment:

| ID | Severity | Rationale |
|---|---|---|
| SECURITY-001 | MEDIUM | Architectural constraint of static Next.js build; documented in PROJ-001; no active exploitation vector given zero user input |
| SECURITY-002 | MEDIUM | FAL CDN URLs are stable for the life of this v1 page; OG image migration to `/public` is recommended before next major revision |
| SECURITY-003 | LOW | Functional issue only; architect-specified RSC structure to be restored in PROJ-006 cleanup sprint |
| SECURITY-004 | LOW | Placeholder CTA — acceptable for staging/preview; must be resolved before public launch |

---

## Deployment Recommendation

**APPROVED FOR DEPLOYMENT** with the following conditions:

1. SECURITY-004 (placeholder `href="#"` Buy Now) MUST be resolved before public launch or the CTA must be clearly marked non-functional in a staging context.
2. SECURITY-002 (external OG image) SHOULD be resolved in the first post-launch sprint.
3. SECURITY-001 and SECURITY-003 are accepted architectural constraints and low-priority improvements for a future sprint.

No CRITICAL or HIGH findings were identified. The security posture of this static marketing page is appropriate for its threat model.

---

## Files Audited

| File | Audited |
|---|---|
| `C:/Paradise/Sankofa/OnePageSite/next.config.ts` | Yes |
| `C:/Paradise/Sankofa/OnePageSite/vercel.json` | Yes |
| `C:/Paradise/Sankofa/OnePageSite/.gitignore` | Yes |
| `C:/Paradise/Sankofa/OnePageSite/.env.example` | Yes |
| `C:/Paradise/Sankofa/OnePageSite/package.json` | Yes |
| `C:/Paradise/Sankofa/OnePageSite/app/layout.tsx` | Yes |
| `C:/Paradise/Sankofa/OnePageSite/lib/content.ts` | Yes |
| `C:/Paradise/Sankofa/OnePageSite/components/Navbar.tsx` | Yes |
| `C:/Paradise/Sankofa/OnePageSite/components/HeroSection.tsx` | Yes |
| `C:/Paradise/Sankofa/OnePageSite/components/FeaturesSection.tsx` | Yes |
| `C:/Paradise/Sankofa/OnePageSite/components/ColorStorySection.tsx` | Yes |
| `C:/Paradise/Sankofa/OnePageSite/components/PricingCTASection.tsx` | Yes |
| `C:/Paradise/Sankofa/OnePageSite/components/PricingSelector.tsx` | Yes |
| `C:/Paradise/Sankofa/OnePageSite/components/StickyMobileCTA.tsx` | Yes |
| `C:/Paradise/Sankofa/OnePageSite/components/Footer.tsx` | Yes |
| `C:/Paradise/Sankofa/OnePageSite/specs/PROJ-001-architecture.md` | Yes (Section 6) |

---

*Security Review completed by Security Reviewer agent. Task ID: PROJ-005. Report written to `specs/PROJ-005-security-report.md`.*
