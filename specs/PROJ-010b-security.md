# Security Review: PROJ-010b — Image Fix Delta Audit

**Task ID:** PROJ-010b
**Assigned To:** Security Reviewer
**From:** Project Manager
**Date:** 2026-03-05
**Scope:** Targeted delta review of PROJ-009 image fix against baseline established in PROJ-005

---

## Overall Status: PASS

All six security checks passed. No regressions introduced. Attack surface reduced by removing the unnecessary `apple.com` domain.

---

## Check Results

### 1. CSP `img-src` allows `v3b.fal.media` and `fal.media`

**Status: PASS**

Both `next.config.ts` (line 21) and `vercel.json` (line 19) contain:

```
img-src 'self' data: https://fal.media https://v3b.fal.media https://*.vercel.app
```

FAL AI image domains are present in both header sources. Images will load correctly in production.

---

### 2. CSP `img-src` no longer contains `https://www.apple.com`

**Status: PASS**

Neither `next.config.ts` nor `vercel.json` contain any reference to `apple.com` in `img-src` or any other directive. The unnecessary domain has been cleanly removed. This is a positive change — attack surface is smaller.

---

### 3. No secrets hardcoded in `lib/content.ts`

**Status: PASS**

All image URLs in `lib/content.ts` are public CDN URLs pointing to `v3b.fal.media` (e.g., `https://v3b.fal.media/files/b/0a9102b4/...`). These are unauthenticated public file paths, not API keys or authenticated resource URLs. No secrets, tokens, or credentials are present in this file.

---

### 4. `remotePatterns` in `next.config.ts` is minimal and correct

**Status: PASS**

`next.config.ts` lines 34–37 define exactly two entries:

```ts
{ protocol: 'https', hostname: 'v3b.fal.media' },
{ protocol: 'https', hostname: 'fal.media' },
```

No wildcard hostnames, no extraneous domains. The pattern is properly scoped and matches the CSP `img-src` allowlist.

---

### 5. All other security headers intact in both files

**Status: PASS**

Both `next.config.ts` and `vercel.json` contain all required security headers, identical in value:

| Header | Value | Present in next.config.ts | Present in vercel.json |
|---|---|---|---|
| `X-Frame-Options` | `DENY` | Yes | Yes |
| `X-Content-Type-Options` | `nosniff` | Yes | Yes |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Yes | Yes |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Yes | Yes |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Yes | Yes |
| `Content-Security-Policy` | (full policy) | Yes | Yes |

The two files are in sync. No headers were removed or weakened.

---

### 6. No new external domains introduced

**Status: PASS**

The only external domains present across all reviewed files are:

- `https://fal.media` — reviewed and approved in PROJ-005
- `https://v3b.fal.media` — reviewed and approved in PROJ-005
- `https://*.vercel.app` — deployment preview origin, approved in PROJ-005

No new domains were added during the PROJ-009 image fix.

---

## Notes

- The `https://*.vercel.app` wildcard in `img-src` remains. This was accepted in PROJ-005 for deployment preview support. It is a low-risk wildcard scoped to Vercel's own infrastructure.
- The `Cache-Control: public, max-age=31536000, immutable` header on `/images/(.*)` in `vercel.json` is appropriate for static CDN-served images and does not introduce any security concern.
- `script-src 'unsafe-inline'` remains present. This was a known accepted trade-off from PROJ-005 (required by Next.js inline scripts). Not a regression.

---

## Summary

The PROJ-009 image fix maintained full parity with the PROJ-005 security baseline. The only CSP change was the removal of `https://www.apple.com` from `img-src`, which is a net security improvement. No regressions, no new domains, no secrets introduced.

**Recommendation:** Clear to proceed. No blocking issues.
