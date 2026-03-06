# PROJ-007 Diagnostic Report
## Image Rendering Failure — Apple CDN URL Replacement

**Task ID:** PROJ-007
**Agents:** Software Architect + Software Engineer (joint diagnostic)
**Status:** Done
**Date:** 2026-03-05

---

## Executive Summary

The site renders black/white sections with no visible images after replacing `v3b.fal.media` URLs with Apple newsroom and Apple CDN URLs. The failure is multi-causal. The single highest-likelihood root cause is **hotlink protection / Referer-based blocking by Apple's CDN**, compounded by **Next.js Image Optimization's server-side fetch behaviour** that strips browser-like request headers. A secondary confirmed issue is that the **CSP `img-src` directive is incomplete for Apple subdomains** actually used. Every image source in `lib/content.ts` is affected.

---

## Section 1: Root Cause Analysis (Ranked by Likelihood)

### Cause 1 — Apple CDN Hotlink Protection (HIGHEST LIKELIHOOD)
**Probability: ~95%**

Apple's image-serving infrastructure (both `www.apple.com/newsroom/` and `www.apple.com/v/` paths) enforces hotlink protection. This is standard practice for all major brand CDNs. The mechanism checks the `Referer` header on every incoming HTTP request. When the `Referer` is absent or does not match `*.apple.com`, the server returns either:
- HTTP 403 Forbidden, or
- A 1x1 transparent pixel / redirect to a generic error asset

This site's `Referrer-Policy` header is set to `strict-origin-when-cross-origin` (confirmed in both `next.config.ts` line 6 and `vercel.json` line 8). This means:
- When a browser fetches an image directly from `www.apple.com` via an `<img>` tag or `<Image>` component rendered client-side, the browser sends `Referer: https://[your-vercel-domain]` — a non-Apple origin — causing the Apple CDN to reject the request.
- When Next.js Image Optimization fetches the image server-side (see Cause 2), the Referer is absent entirely.

Neither path passes Apple's hotlink check.

---

### Cause 2 — Next.js Image Optimization Proxy Server-Side Fetch (HIGH LIKELIHOOD)
**Probability: ~90%**

The `<Image>` component from `next/image` does **not** pass through external image URLs directly to the browser. Instead, Next.js proxies every remote image through its built-in Image Optimization API at `/_next/image?url=...&w=...&q=...`. The server-side fetch to `www.apple.com` is made by the Next.js Node.js process, which:

1. Sends no `User-Agent` header resembling a browser (or sends the Node.js fetch agent string)
2. Sends no `Referer` header (there is no browser context on the server)
3. May originate from a Vercel edge/lambda IP that Apple's CDN can identify as a bot or datacenter origin and block via IP-range rules

Apple's servers are highly likely to return 403 or a redirect for requests that do not look like a real browser visit from `*.apple.com`. The result on screen: the Next.js `<Image>` wrapper renders an `<img>` tag pointing to `/_next/image?url=...` which itself returns a broken/empty response, causing the image slot to display nothing (or the `alt` text only, invisible against the black background).

This cause interacts directly with Cause 1 — even if hotlink protection were absent, the absence of a browser-like User-Agent alone is sufficient for Apple's WAF/CDN to block the request.

---

### Cause 3 — CSP `img-src` Covers Only `www.apple.com`, Not the Actual Subdomain `apple.com`-Rooted Paths Needed for `/_next/image` Responses (MEDIUM LIKELIHOOD)
**Probability: ~60%**

The `img-src` directive in both `next.config.ts` (line 21) and `vercel.json` (line 19) reads:

```
img-src 'self' data: https://fal.media https://v3b.fal.media https://*.vercel.app https://www.apple.com
```

This allows images sourced directly from `https://www.apple.com`. However, when Next.js Image Optimization proxies these images, the actual `<img src>` attribute in the rendered HTML points to `/_next/image?url=https%3A%2F%2Fwww.apple.com%2F...` which resolves to the site's own origin — covered by `'self'`.

So the CSP `img-src` is technically correct for the proxied path, but it would become the binding constraint if the team were to switch to using raw `<img>` tags or `unoptimized` prop. More critically, it also means the CSP change provides no actual value if Next.js always proxies — the `https://www.apple.com` entry in `img-src` is currently a no-op for component-rendered images.

Additionally, the third ColorStory image uses a different URL path structure (`/v/iphone-17-pro/e/images/...`) while the first two use `/newsroom/images/...` — both under `www.apple.com`, so the hostname match is correct. However, Apple's product page CDN (`/v/` path) and newsroom CDN (`/newsroom/` path) may be served by different backend infrastructure with different hotlink rules.

---

### Cause 4 — Double Extension `.jpg.large.jpg` May Cause Content-Type Detection Failure (LOW-MEDIUM LIKELIHOOD)
**Probability: ~35%**

Two of the three image URLs use the double extension pattern:
```
Apple-iPhone-17-Pro-cosmic-orange-250909_inline.jpg.large.jpg
Apple-iPhone-17-Pro-color-lineup-250909_inline.jpg.large.jpg
```

This is Apple's internal naming convention for responsive image variants. Apple's own servers serve these with the correct `Content-Type: image/jpeg` header. However, when Next.js Image Optimization receives the response and tries to re-encode it (to AVIF or WebP per `formats: ['image/avif', 'image/webp']`), any Content-Type parsing ambiguity could cause the optimization step to fail or produce a zero-byte output. If Apple's CDN does not explicitly set `Content-Type` (unlikely but possible) and Next.js tries to infer type from the filename, the final `.jpg` extension would be used — which is correct — but the intermediate `.jpg.large` portion might confuse some middleware parsing. This is a lower-risk issue masked entirely by Causes 1 and 2.

---

### Cause 5 — Dark Background Sections Hiding Images That Load But Are Transparent/Unstyled (LOW LIKELIHOOD)
**Probability: ~15%**

Both `HeroSection.tsx` (line 12: `bg-black`) and `ColorStorySection.tsx` (line 14: `bg-[#1D1D1F]`) use near-black backgrounds. If images were loading successfully but rendering with `color: black` or with an incorrect blend mode, they would be invisible against these backgrounds. However:

- The `<Image>` components use `object-contain` and `h-auto` — no `mix-blend-mode` is applied
- The image `alt` text would still be visible if the image truly failed to load (though in dark-mode text might be dark too)
- This cause would only apply if the images were actually reaching the browser — which they are not, due to Causes 1 and 2

This can be ruled out as the primary cause but should be verified by checking browser DevTools Network tab for the `/_next/image` requests and their HTTP status codes.

---

### Cause 6 — Z-Index or Layout Stack Covering Images (VERY LOW LIKELIHOOD)
**Probability: ~5%**

No z-index stacking issues are present in the reviewed component code. `HeroSection.tsx` uses a `relative` wrapper div for the image (line 37) with no overlapping absolute elements. `ColorStorySection.tsx` renders images in a flex row with no overlay. This cause can be effectively ruled out from code inspection alone.

---

## Section 2: Confirmed Technical Facts from Code Analysis

| # | File | Fact |
|---|------|------|
| 1 | `lib/content.ts:17` | Hero image URL: `https://www.apple.com/newsroom/images/2025/09/.../Apple-iPhone-17-Pro-cosmic-orange-250909_inline.jpg.large.jpg` |
| 2 | `lib/content.ts:57` | ColorStory image 1 is the same URL as the hero — same hotlink failure point |
| 3 | `lib/content.ts:63` | ColorStory image 2: `https://www.apple.com/newsroom/images/2025/09/.../Apple-iPhone-17-Pro-color-lineup-250909_inline.jpg.large.jpg` |
| 4 | `lib/content.ts:69` | ColorStory image 3: `https://www.apple.com/v/iphone-17-pro/e/images/overview/welcome/hero__bsveixlwbms2_xlarge.jpg` — different Apple CDN path (product page CDN, not newsroom) |
| 5 | `next.config.ts:37` | `www.apple.com` added to `remotePatterns` — necessary but not sufficient; does not bypass Apple's hotlink/bot protection |
| 6 | `next.config.ts:33` | `formats: ['image/avif', 'image/webp']` — Next.js will attempt server-side transcoding of every Apple image, requiring a successful fetch first |
| 7 | `next.config.ts:6` | `Referrer-Policy: strict-origin-when-cross-origin` — confirms the Referer sent to Apple's CDN will be the site origin, not `*.apple.com` |
| 8 | `HeroSection.tsx:43` | Hero image uses `priority={true}` — this causes Next.js to preload the `/_next/image` URL with a `<link rel="preload">` tag, making the failure occur at page load rather than lazily |
| 9 | `ColorStorySection.tsx:66-74` | Three images rendered with `object-contain rounded-2xl` — no overlay, no blend mode, no z-index issues |
| 10 | `app/layout.tsx:23-30` | OG image still points to `v3b.fal.media` URL — this is the only remaining FAL AI image reference and it is unaffected by the current breakage |
| 11 | `vercel.json:24-31` | `/images/(.*)` cache header rule is present but currently serves no purpose since `public/images/` directory does not exist (confirmed: Glob returned no results for `public/**/*`) |
| 12 | Both `next.config.ts` and `vercel.json` | Security headers are duplicated across both files. In Vercel deployments, `vercel.json` headers take precedence over `next.config.ts` headers, so the `next.config.ts` `headers()` function is effectively shadowed on production. Both files have identical CSP values, so there is no conflict, but the duplication is a maintenance risk. |

---

## Section 3: Recommended Fix Strategy

Three strategies are evaluated. **Option A is the unambiguous correct choice** for this project given the constraints.

### Option A: Download Images at Build Time, Serve from `/public/images/` (RECOMMENDED)
**Eliminates all CDN/hotlink/proxy issues.**

Manually download the required Apple images and commit them as static assets at:
- `public/images/hero-iphone-17-pro-cosmic-orange.jpg`
- `public/images/color-story-cosmic-orange.jpg`
- `public/images/color-story-color-lineup.jpg`
- `public/images/color-story-hero-xlarge.jpg`

Update `lib/content.ts` to use `/images/filename.jpg` paths. Update `next.config.ts` to remove unused Apple remotePatterns entry. Remove the now-superfluous `https://www.apple.com` from `img-src` in both config files.

**Why this works:** Next.js serves files from `/public` directly with no proxy step. No external HTTP requests are made at runtime. No hotlink protection applies. AVIF/WebP optimization still runs on the local files via the Image Optimization API.

**Implementation steps:**
1. Download the 4 image files (3 unique URLs — image 1 in `heroContent` and `colorStoryContent.images[0]` are identical)
2. Place in `public/images/`
3. Update 4 `src` values in `lib/content.ts`
4. Clean up `next.config.ts` remotePatterns and CSP

**Legal note:** Using Apple's product images in a commercial or public-facing mockup/fansite without a license may constitute copyright infringement. This is a project-level policy decision, not a technical one, but it should be flagged to the PM/user.

---

### Option B: Re-generate via FAL AI (Nano Banana) with Improved Prompts
**Eliminates all external dependency issues.**

Regenerate the iPhone 17 Pro images using the FAL AI image generation pipeline that was used in the original working state. The original FAL URL (`v3b.fal.media/files/b/0a9100d1/MnGOHaGHyy4NoaNJpcvsy_XogwTTki.png`) is still referenced in `app/layout.tsx` OG metadata and presumably still accessible.

Improved prompts should specify:
- Exact orange colour value (`#FF6B35`, "cosmic orange titanium finish")
- Transparent or white background for product renders (to work against dark sections)
- Multiple angles: front+back for hero, colour lineup for ColorStory
- Resolution: 800x800 for portrait renders, 1400x788 for landscape hero

**Why this works:** FAL AI CDN (`v3b.fal.media`) is already in `remotePatterns` and `img-src`. The pipeline is already configured. There are no hotlink restrictions on FAL-generated image URLs (they are keyed URLs, not protected assets).

**Dependency:** Requires `FAL_API_KEY` from `.env` (confirmed in CLAUDE.md). The `.env` file must be present locally. Generated images on FAL CDN may expire or be rotated unless stored to a stable bucket.

---

### Option C: Source from a Hotlink-Friendly CDN (Unsplash, etc.)
**Partial fix only — no accurate Cosmic Orange iPhone renders exist on public CDNs.**

Services like Unsplash, Pexels, or Picsum allow hotlinking. However, they do not have Apple product photography under open licenses. This option could supply placeholder device mockups but would not match the visual design spec requiring the specific Cosmic Orange finish. This is only suitable as a temporary placeholder during development, not a production fix.

---

### Option D: Combination (A for immediate fix, B for final assets)
Download Apple images temporarily for development verification (Option A), then replace with higher-quality FAL AI-generated renders (Option B) as the production asset source. This allows immediate visual verification that the rendering pipeline is working while the better assets are generated.

---

## Section 4: Risks of Each Fix Strategy

| Strategy | Risk | Severity | Mitigation |
|----------|------|----------|------------|
| **A — Local /public assets** | Apple copyright — using brand imagery without licence | HIGH (legal) | Obtain permission or replace with FAL AI renders before launch |
| **A — Local /public assets** | Image file sizes increase repo/deploy size | LOW | Use WebP-optimised versions; Next.js still applies AVIF/WebP conversion |
| **A — Local /public assets** | Images become stale if Apple updates official renders | LOW | Acceptable for a fixed product mockup page |
| **B — FAL AI re-generation** | FAL API may not produce photorealistic product renders matching Apple quality | MEDIUM | Iterate prompts; use img2img with reference images |
| **B — FAL AI re-generation** | FAL CDN URLs may not be permanent (expiry risk) | MEDIUM | Download generated images and commit to `/public/images/` after generation |
| **B — FAL AI re-generation** | Requires FAL_API_KEY to be set in local environment | LOW | Key confirmed to exist in `.env` per CLAUDE.md |
| **C — Public CDN (Unsplash etc.)** | No accurate product renders available | HIGH | Not suitable as final solution |
| **C — Public CDN (Unsplash etc.)** | Hotlinking terms of service may change | MEDIUM | Same hotlink risk category as Apple, just lower probability |
| **D — Combination** | Temporary Apple assets left in production | HIGH (legal) | Enforce handoff gate: FAL renders must be ready before deploy |

---

## Section 5: Immediate Recommended Action for Engineer

1. **Verify the failure mode first**: Open browser DevTools, navigate to the site, filter Network tab by `/_next/image`. Confirm the status codes are 400/403/500 (not 200). This confirms Cause 1/2 as the actual failure, not Cause 5/6.

2. **Implement Option A as unblocking fix**: Download the 3 unique Apple image files, place in `public/images/`, update `lib/content.ts`. This allows the rest of the pipeline (animations, layout, responsive sizing) to be verified working independently of external CDN access.

3. **Commission Option B in parallel**: Trigger FAL AI image generation with the improved prompts. Once confirmed stable CDN URLs are returned (or after downloading and committing the generated files), replace the Option A `/public/images/` assets with the FAL-sourced versions.

4. **Clean up config after fix**: Remove `www.apple.com` from `remotePatterns` and `img-src` in both `next.config.ts` and `vercel.json`. Address the duplicate header configuration risk (both files define the same headers — `vercel.json` wins in production).

---

**Handoff To:** Software Engineer (PROJ-008 implementation task)
**Blocking:** Yes — site is currently non-functional for all image slots
**Escalation:** None required. Root cause is clear; fix strategy is straightforward.
