# Architecture Specification: iPhone 17 Pro Max — Cosmic Orange Landing Page

**Task ID:** PROJ-001
**Status:** Done
**Author:** Software Architect
**Date:** 2026-03-05
**Reviewed By:** Project Manager

---

## Section 1: System Overview

### Purpose

A single-page, fully responsive static marketing landing page for the iPhone 17 Pro Max in the "Cosmic Orange" colorway. The page functions as a product showcase with no backend, no database, and no authentication. It is a pure SSG (Static Site Generation) deployment targeting Vercel Edge Network.

### Scope

- Frontend-only Next.js 15 App Router project
- Zero server-side dynamic logic at runtime
- All content is compile-time static; no API routes required
- Image assets may originate from FAL AI (external CDN) or be placed in `/public`
- Single deployable artifact: a fully static export or Vercel-hosted SSG build

### System Context Diagram

```
Browser (375px – 1440px)
        │
        ▼
  Vercel Edge CDN  ◄──── GitHub (CI/CD push triggers)
        │
        ▼
  Static HTML/CSS/JS (Next.js SSG output)
        │
        ├── next/image (WebP/AVIF via Vercel Image Optimization)
        └── FAL AI image assets (external CDN URLs, lazy-loaded)
```

---

## Section 2: Architecture Decisions & Justifications

### Decision 1: Next.js 15 App Router with SSG

**Choice:** `export default` page components under `app/` using static rendering (no `dynamic = 'force-dynamic'`, no server actions at runtime).

**Justification:**
- `generateStaticParams` is not needed (single page), so the route `app/page.tsx` is automatically statically rendered at build time.
- App Router provides React Server Components (RSC) by default, reducing client-side JS bundle for non-interactive sections.
- Built-in `next/image` handles WebP/AVIF conversion and responsive `srcset` with Vercel's Image Optimization API.
- ISR is available for future content refresh without a full redeploy, though not required for v1.

**Rejected alternatives:**
- Vite + React SPA: lacks built-in image optimization and SSG routing conventions.
- Gatsby: heavier plugin ecosystem; Next.js 15 has equivalent SSG with less configuration.

### Decision 2: Tailwind CSS 3.4

**Choice:** Utility-first CSS with a custom Cosmic Orange design token extension in `tailwind.config.ts`.

**Justification:**
- Zero-runtime CSS — all classes are purged at build time, minimizing stylesheet payload.
- Design tokens (colors, typography, spacing) are co-located in `tailwind.config.ts`, making them the single source of truth.
- No CSS-in-JS runtime overhead (vs. styled-components, Emotion).

### Decision 3: Framer Motion for Animations

**Choice:** `motion` components with `whileInView` / `viewport` triggers for scroll-based animations.

**Justification:**
- Viewport-based animations (`whileInView`) do not require a global scroll listener, reducing layout thrashing.
- Tree-shakeable — only imported animation primitives are bundled.
- `AnimatePresence` is available for sticky CTA mount/unmount transitions.
- Hardware-accelerated (`transform`, `opacity`) — no impact on CLS.

**Performance constraint:** All Framer Motion animations MUST use `transform` and `opacity` only. No animations on `width`, `height`, `top`, `left`, or `margin` to prevent layout recalculation and CLS regression.

### Decision 4: Vercel Deployment (Static + Edge Headers)

**Choice:** Deploy via Vercel with `vercel.json` defining security headers at the CDN edge layer.

**Justification:**
- Automatic HTTPS, HTTP/2, and global CDN distribution.
- `vercel.json` headers are applied at the edge with zero latency overhead.
- Vercel Image Optimization API handles on-the-fly WebP/AVIF conversion for `next/image`.

---

## Section 3: Component Architecture

### Component Tree

```
app/
└── page.tsx                  (root RSC, composes all sections)
    ├── components/Navbar.tsx
    ├── components/HeroSection.tsx
    ├── components/FeaturesSection.tsx
    ├── components/ColorStorySection.tsx
    ├── components/PricingCTASection.tsx
    ├── components/StickyMobileCTA.tsx   (client component)
    └── components/Footer.tsx
```

### Component Specifications

#### `app/page.tsx`
- **Type:** React Server Component (RSC)
- **Responsibility:** Composes all section components in order. Applies `scroll-smooth` to the `<html>` element via `layout.tsx`. No client-side state.
- **Data:** None. All content is inlined as TypeScript constants or imported from `lib/content.ts`.

#### `components/Navbar.tsx`
- **Type:** Client Component (`'use client'`) for scroll-aware transparency effect
- **Behavior:** Fixed position, transitions from transparent to `bg-white/90 backdrop-blur-md` on scroll past 80px. Contains anchor links for smooth scroll to each section (`#hero`, `#features`, `#color-story`, `#pricing`).
- **Mobile:** Collapses to hamburger icon below `md` breakpoint. Menu is an overlay with `AnimatePresence` slide-down.
- **Accessibility:** `role="navigation"`, `aria-label="Main navigation"`, focus trap on open mobile menu.

#### `components/HeroSection.tsx`
- **Type:** RSC (static content, no interactivity)
- **Behavior:** Full-viewport (`min-h-screen`) hero. Background: radial gradient from `#FF6B35` to `#1D1D1F`. Centered product image of iPhone 17 Pro Max Cosmic Orange using `next/image` with `priority={true}` (LCP element). Headline, subheadline, and a primary CTA button linking to `#pricing`.
- **Image:** `width={390}` `height={844}` (phone aspect ratio), `sizes="(max-width: 768px) 90vw, 45vw"`, format WebP/AVIF via Vercel. Hero image file MUST be under 100kb after optimization.
- **Animation:** `motion.div` with `initial={{ opacity: 0, y: 40 }}` → `animate={{ opacity: 1, y: 0 }}` on mount (not scroll-triggered, fires immediately).

#### `components/FeaturesSection.tsx`
- **Type:** RSC
- **Behavior:** Grid of 3–4 feature cards. Each card: icon (SVG inline), feature title, one-line description. Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`.
- **Content (from `lib/content.ts`):**
  1. A18 Pro Bionic chip — "Desktop-class performance"
  2. 48MP Fusion Camera — "Pro photography in your pocket"
  3. Titanium frame — "Aerospace-grade durability"
  4. All-day battery — "Up to 29 hours video playback"
- **Animation:** Each card uses `motion.div` with `whileInView={{ opacity: 1, y: 0 }}` and `viewport={{ once: true, margin: "-50px" }}`.

#### `components/ColorStorySection.tsx`
- **Type:** RSC
- **Behavior:** Full-bleed section showcasing the Cosmic Orange colorway. Left: large product lifestyle image. Right: color swatch grid (Cosmic Orange + 2 complementary tones), color name, and a short narrative paragraph. On mobile: stacks vertically, image on top.
- **Image:** `next/image` lazy loaded, `sizes="(max-width: 768px) 100vw, 50vw"`.
- **Animation:** Image slides in from left (`x: -60 → 0`), text fades in from right (`x: 60 → 0`) using `whileInView`.

#### `components/PricingCTASection.tsx`
- **Type:** RSC (pricing data from `lib/content.ts`)
- **Behavior:** Two pricing tiers (128GB / 256GB / 512GB displayed as three option cards). Selected tier highlighted with `border-[#FF6B35]`. "Buy Now" button: `bg-[#FF6B35] hover:bg-[#CC5228]`, full-width on mobile.
- **Note:** Pricing state (selected tier) requires a thin Client Component wrapper `PricingSelector.tsx` (`'use client'`). The outer section remains RSC; only the interactive selector is a client island.

#### `components/StickyMobileCTA.tsx`
- **Type:** Client Component (`'use client'`)
- **Behavior:** Visible only on `md:hidden` (below 768px). Sticks to the bottom of the viewport after the user scrolls past the Hero CTA button (detected via `IntersectionObserver` on the Hero CTA). Uses `AnimatePresence` + `motion.div` with `y: 100 → 0` entrance animation. Contains "Buy Now — From $1,299" and links to `#pricing`. Has `z-50` and `pb-safe` (iOS safe area inset via Tailwind `pb-[env(safe-area-inset-bottom)]`).
- **Dismissal:** Not dismissible; hides when user reaches `#pricing` section (second `IntersectionObserver`).

#### `components/Footer.tsx`
- **Type:** RSC
- **Behavior:** Three columns on desktop, stacked on mobile. Links: Privacy Policy, Terms of Use, Accessibility. Copyright: "© 2026 Sankofa. All rights reserved. iPhone is a trademark of Apple Inc." Social icons (SVG, aria-labeled). Background: `#1D1D1F`, text: `#6E6E73`.

---

## Section 4: Data Flow & State Management

### Data Architecture

This is a zero-API, zero-database, zero-auth project. All data is static.

```
lib/
└── content.ts       # All page copy, feature data, pricing tiers as typed TS constants
```

**`lib/content.ts` exports:**
```typescript
export const heroContent: HeroContent
export const featuresContent: FeatureCard[]
export const colorStoryContent: ColorStoryContent
export const pricingTiers: PricingTier[]
export const footerLinks: FooterLink[]
```

### Client State (minimal)

| State | Location | Mechanism |
|---|---|---|
| Mobile nav open/closed | `Navbar.tsx` | `useState` |
| Navbar scroll transparency | `Navbar.tsx` | `useEffect` + `scroll` event |
| Sticky CTA visibility | `StickyMobileCTA.tsx` | `IntersectionObserver` via `useEffect` |
| Selected pricing tier | `PricingSelector.tsx` | `useState` |

No global state manager (Redux, Zustand, Jotai) is needed. All state is local to client islands.

### FAL AI Image Integration

If product images are generated via FAL AI:
- Images are fetched at **build time** using a build script (`scripts/fetch-images.ts`) that calls the FAL API using `FAL_API_KEY` from `.env`.
- Downloaded images are saved to `public/images/` as WebP files.
- The `FAL_API_KEY` is **never** referenced in client-side code or included in the Next.js bundle.
- At runtime, images are served from `/public` (CDN-cached by Vercel) — no FAL API calls at runtime.

---

## Section 5: Performance Strategy

### Core Web Vitals Targets

| Metric | Target | Strategy |
|---|---|---|
| LCP | < 2.5s | Hero image: `priority={true}`, `<100kb`, preloaded via `<link rel="preload">` in `<head>` |
| CLS | < 0.1 | All images have explicit `width` + `height`. Framer Motion uses `transform`/`opacity` only. No FOUT (system font stack). |
| FID/INP | < 100ms | Minimal client JS. No heavy third-party scripts. |

### Image Optimization

- All images served via `next/image` component.
- Vercel Image Optimization API auto-converts to WebP/AVIF based on `Accept` header.
- `sizes` attribute on every image for responsive `srcset` generation.
- Non-hero images: `loading="lazy"` (default in `next/image`).
- Hero image: `priority={true}` disables lazy loading and injects `<link rel="preload">`.
- Image size budgets:
  - Hero product image: **< 100kb** (WebP, optimized)
  - Feature icons: SVG inline (0kb network)
  - Color story image: < 150kb (WebP)

### Bundle Size Strategy

- RSC by default: server-rendered sections ship zero client JS.
- Client components (`'use client'`) are isolated to interactive islands only.
- Dynamic import for Framer Motion in non-critical sections:
  ```typescript
  const MotionDiv = dynamic(() => import('framer-motion').then(m => m.motion.div), { ssr: false })
  ```
  Note: Only apply `dynamic` to below-the-fold sections. Hero animations use static import to avoid layout shift.
- Tailwind CSS: purged at build, estimated < 10kb gzipped.
- Target total JS bundle (first load): **< 100kb gzipped**.

### Caching Strategy

- Vercel Edge Network caches all static assets with `Cache-Control: public, max-age=31536000, immutable` (set automatically by Next.js for hashed assets).
- HTML page: `Cache-Control: s-maxage=86400, stale-while-revalidate` (ISR-compatible, even for static pages).
- No client-side caching layer needed (no API calls at runtime).

### Font Loading

- Font stack: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif`
- System fonts only — zero network font requests, zero FOUT, zero render-blocking.

---

## Section 6: Security Architecture

### Threat Model

This is a static marketing page with no user input, no auth, and no backend. The primary attack surfaces are:

1. **XSS via injected third-party scripts** — mitigated by CSP.
2. **Clickjacking** — mitigated by `X-Frame-Options`.
3. **MIME sniffing attacks** — mitigated by `X-Content-Type-Options`.
4. **Protocol downgrade / MITM** — mitigated by HSTS.
5. **Secret exposure** — FAL_API_KEY used only at build time, never in client bundle.

### Security Headers

Applied via both `next.config.ts` and `vercel.json` (belt-and-suspenders):

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https://fal.media https://*.vercel.app;
  font-src 'self';
  connect-src 'self';
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self'

Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

**Note on `unsafe-inline`:** Required for Next.js inline style injection and Framer Motion inline transforms. A nonce-based CSP can be adopted in a future iteration if stricter policy is desired, but would require middleware (not compatible with pure static export).

### Secret Management

- `.env` contains `FAL_API_KEY` — **never committed** (`.gitignore` entry required).
- `.env.example` committed with placeholder: `FAL_API_KEY=your_fal_api_key_here`.
- No `NEXT_PUBLIC_` prefix on `FAL_API_KEY` — ensures it is never exposed to the browser bundle.
- Vercel environment variables dashboard used for production secret injection.

### Dependency Security

- `npm audit` run as part of CI.
- Dependabot alerts enabled on the GitHub repository.
- No user-generated content → no sanitization layer needed at v1.

---

## Section 7: File & Folder Structure

```
C:/Paradise/Sankofa/OnePageSite/
├── .env                              # Local secrets (never committed)
├── .env.example                      # Committed placeholder for all required env vars
├── .gitignore                        # Includes .env, .next/, node_modules/
├── .eslintrc.json                    # ESLint config (Next.js + TypeScript rules)
├── .prettierrc                       # Prettier config (100 char line limit, single quotes)
├── next.config.ts                    # Security headers, image domains, output config
├── tailwind.config.ts                # Custom Cosmic Orange tokens, font stack
├── tsconfig.json                     # TypeScript strict mode
├── postcss.config.js                 # Tailwind + Autoprefixer
├── vercel.json                       # Edge headers, rewrites (if any)
├── package.json
│
├── specs/
│   └── PROJ-001-architecture.md      # This file
│
├── scripts/
│   └── fetch-images.ts               # Build-time FAL AI image fetcher (uses FAL_API_KEY)
│
├── public/
│   ├── images/
│   │   ├── hero-iphone17-cosmic-orange.webp
│   │   ├── color-story-lifestyle.webp
│   │   └── og-image.png              # Open Graph / social preview (1200x630)
│   ├── favicon.ico
│   └── robots.txt
│
├── app/
│   ├── layout.tsx                    # Root layout: <html lang="en">, metadata, global styles
│   ├── page.tsx                      # Root page: composes all section components
│   ├── globals.css                   # Tailwind directives (@tailwind base/components/utilities)
│   └── not-found.tsx                 # 404 page (minimal, on-brand)
│
├── components/
│   ├── Navbar.tsx                    # 'use client' — scroll-aware, mobile hamburger
│   ├── HeroSection.tsx               # RSC — full-viewport hero, priority image
│   ├── FeaturesSection.tsx           # RSC — feature card grid
│   ├── ColorStorySection.tsx         # RSC — color showcase with lifestyle image
│   ├── PricingCTASection.tsx         # RSC shell — wraps PricingSelector island
│   ├── PricingSelector.tsx           # 'use client' — tier selection state
│   ├── StickyMobileCTA.tsx           # 'use client' — IntersectionObserver, AnimatePresence
│   └── Footer.tsx                    # RSC — links, copyright
│
└── lib/
    ├── content.ts                    # All static page copy and data (typed TS constants)
    └── types.ts                      # Shared TypeScript interfaces (HeroContent, FeatureCard, etc.)
```

### Key Configuration Files

#### `next.config.ts`
```typescript
import type { NextConfig } from 'next'

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://fal.media https://*.vercel.app",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
]

const config: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'fal.media' },
    ],
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
}

export default config
```

#### `tailwind.config.ts` (token extension)
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cosmic: {
          orange: '#FF6B35',
          'orange-dark': '#CC5228',
          'orange-light': '#FF8C5A',
        },
        apple: {
          bg: '#F5F5F7',
          text: '#1D1D1F',
          secondary: '#6E6E73',
          dark: '#1D1D1F',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"Segoe UI"',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}

export default config
```

#### `vercel.json`
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=63072000; includeSubDomains; preload"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    },
    {
      "source": "/images/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

## Section 8: Scalability & Availability

### Vercel Edge Network

- **CDN:** All static assets (HTML, CSS, JS, images) served from Vercel's global Edge Network (~100+ PoPs worldwide).
- **Availability target:** 99.9% — achieved via Vercel's infrastructure SLA. No custom infrastructure to manage.
- **Traffic spikes:** Static files are infinitely scalable at the CDN layer. No origin server load under normal conditions.
- **Image Optimization:** Vercel's Image Optimization API scales horizontally. Transformed images are cached at the CDN edge after first request.

### ISR (Incremental Static Regeneration) — Future Path

While v1 is pure SSG (no revalidation needed), ISR can be enabled by adding `revalidate` export to `app/page.tsx` if content needs periodic refresh:

```typescript
export const revalidate = 86400 // Revalidate daily
```

This allows content updates without a full redeploy, with zero availability impact.

### Performance at Scale

- No database queries → no N+1 risk.
- No API routes → no serverless function cold starts for page delivery.
- All interactivity is client-side JS (< 100kb gzipped) — no server round-trips for interactions.

### Monitoring (Post-Deploy)

- **Vercel Analytics:** Enable Real User Monitoring (RUM) for Core Web Vitals tracking in production.
- **Vercel Speed Insights:** Per-page performance scoring.
- **Uptime:** Vercel status page + optional Uptime Robot ping on production URL.

---

## Section 9: Implementation Roadmap & Acceptance Criteria

### Phase 1: Project Scaffolding
- [ ] `npx create-next-app@latest` with TypeScript, Tailwind, App Router, no src/ directory
- [ ] Install Framer Motion: `npm install framer-motion`
- [ ] Configure `tailwind.config.ts` with Cosmic Orange tokens
- [ ] Configure `next.config.ts` with security headers and image domains
- [ ] Create `vercel.json` with edge headers
- [ ] Add `.env.example`, update `.gitignore`
- [ ] Create `lib/content.ts` and `lib/types.ts`

### Phase 2: Component Implementation (order matters for LCP)
1. `app/layout.tsx` — root metadata, OG tags, viewport meta, `scroll-smooth`
2. `components/HeroSection.tsx` — LCP critical path, priority image
3. `components/Navbar.tsx` — navigation anchor links
4. `components/FeaturesSection.tsx` — feature cards with scroll animations
5. `components/ColorStorySection.tsx` — color showcase
6. `components/PricingCTASection.tsx` + `PricingSelector.tsx` — pricing tier selection
7. `components/StickyMobileCTA.tsx` — IntersectionObserver sticky CTA
8. `components/Footer.tsx` — links and copyright
9. `app/page.tsx` — final composition

### Phase 3: Optimization & QA
- [ ] Run `next build` and verify no TypeScript or ESLint errors
- [ ] Lighthouse audit: LCP < 2.5s, CLS < 0.1, FID < 100ms
- [ ] Verify hero image is under 100kb (WebP)
- [ ] WCAG AA check: color contrast ratios (orange `#FF6B35` on white fails AA at small text — use on large text / buttons only; body text remains `#1D1D1F`)
- [ ] Cross-browser: Chrome, Firefox, Safari (WebKit), Edge
- [ ] Responsive: 375px, 390px, 768px, 1024px, 1440px breakpoints

### Phase 4: Deployment
- [ ] Connect repository to Vercel
- [ ] Set `FAL_API_KEY` in Vercel environment variables (if FAL images used)
- [ ] Trigger production deploy
- [ ] Verify security headers via `https://securityheaders.com`
- [ ] Confirm Core Web Vitals in Vercel Analytics after first real user visits

### Acceptance Criteria Checklist

| # | Criterion | Met By |
|---|---|---|
| 1 | Component tree defined: Nav, Hero, Features, ColorStory, Pricing+CTA, Footer | Section 3 |
| 2 | Performance strategy: image optimization, lazy loading, CDN | Section 5 |
| 3 | Tech choices justified: Next.js 15 SSG, Tailwind, Framer Motion | Section 2 |
| 4 | Scalability: Vercel Edge Network caching + CDN | Section 8 |
| 5 | Security: CSP headers, no exposed secrets, next.config.ts headers | Section 6 |
| 6 | File/folder structure for Next.js App Router project | Section 7 |
| 7 | All 9 sections present and filled | This document |

---

## Appendix A: WCAG AA Color Compliance Notes

| Usage | Foreground | Background | Ratio | AA Pass |
|---|---|---|---|---|
| Body text | `#1D1D1F` | `#FFFFFF` | 19.6:1 | YES |
| Secondary text | `#6E6E73` | `#FFFFFF` | 5.9:1 | YES (large text) |
| CTA button text | `#FFFFFF` | `#FF6B35` | 3.0:1 | FAIL small text |
| CTA button text | `#FFFFFF` | `#FF6B35` | 3.0:1 | PASS large text (>18pt bold) |
| CTA button text | `#FFFFFF` | `#CC5228` | 4.6:1 | YES |

**Recommendation:** CTA button text must use font size >= 18px bold (or 24px normal) to meet AA at the `#FF6B35` background. Use `#CC5228` (hover state) as the default button background if strict small-text AA compliance is required.

---

## Appendix B: Open Questions for UI/UX Designer

1. Are product images sourced from FAL AI generation or provided as static assets? (Impacts build script and image optimization pipeline)
2. Is the mobile hamburger menu a full-screen overlay or a dropdown panel?
3. Should the Cosmic Orange hero background use a radial gradient or a solid color with a geometric SVG overlay?
4. Confirm exact pricing: storage tiers and USD amounts for the three `PricingTier` cards.
5. Are social media links required in the footer, and if so, which platforms?
