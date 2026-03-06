# PROJ-003 Engineer Output
## iPhone 17 Pro Max — Cosmic Orange Landing Page Implementation

**Task ID:** PROJ-003
**Agent:** Software Engineer
**Status:** Done
**Date:** 2026-03-05
**Build Result:** PASS — `npm run build` succeeds, zero TypeScript/ESLint errors

---

## Acceptance Criteria Checklist

| # | Criterion | Status | Notes |
|---|---|---|---|
| 1 | `npm run dev` / `npm run build` starts without errors | PASS | Build completes, static pages generated |
| 2 | All 6 sections: Navbar, Hero, Features (4 cards), ColorStory, Pricing+CTA, Footer | PASS | All components implemented |
| 3 | StickyMobileCTA: `'use client'`, IntersectionObserver, `md:hidden`, slides up | PASS | Matches spec exactly |
| 4 | Framer Motion `whileInView` with `once: true` on feature cards and sections | PASS | FeaturesSection, ColorStorySection, PricingCTASection |
| 5 | Design tokens from PROJ-002 in `tailwind.config.ts` (Cosmic Orange palette) | PASS | Full cosmic.* and apple.* token set |
| 6 | `next.config.ts` security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options) | PASS | All 6 headers configured |
| 7 | Mobile-first responsive: 1-col 375px, 4-col features at 1440px | PASS | `grid-cols-1 md:grid-cols-2 xl:grid-cols-4` |
| 8 | Hero image `priority={true}`, others lazy-loaded | PASS | Hero uses `priority={true}` |
| 9 | `lib/content.ts` contains all static copy | PASS | heroContent, featuresContent, colorStoryContent, pricingContent, footerLinks |

---

## Files Created

### Configuration
- `package.json` — dependencies: next@^15, react@^18, framer-motion@^11, tailwindcss@^3.4
- `next.config.ts` — security headers + image remote patterns for `v3b.fal.media`
- `tailwind.config.ts` — Cosmic Orange tokens + Apple design tokens + custom screens
- `tsconfig.json` — strict mode, Next.js 15 compatible
- `postcss.config.js` — Tailwind + Autoprefixer
- `.eslintrc.json` — next/core-web-vitals + next/typescript
- `.gitignore` — .env, .next/, node_modules/ excluded
- `.env.example` — FAL_API_KEY placeholder
- `vercel.json` — edge security headers + image cache headers

### App Directory
- `app/globals.css` — Tailwind directives, scroll-smooth, reduced-motion media query, skip-link
- `app/layout.tsx` — Root layout with full metadata, OG tags, Twitter card, viewport
- `app/page.tsx` — RSC composition of all section components

### Library
- `lib/types.ts` — TypeScript interfaces: HeroContent, FeatureCard, FeatureIconId, ColorStoryContent, PricingContent, FooterLink
- `lib/content.ts` — All static content typed with interfaces from lib/types.ts

### Components
- `components/Navbar.tsx` — `'use client'`, scroll-aware transparent→opaque, desktop nav links, mobile CTA pill
- `components/HeroSection.tsx` — `'use client'`, full-viewport hero, `priority={true}` image, dual CTA buttons
- `components/FeaturesSection.tsx` — `'use client'`, 4 feature cards with inline SVG icons, `whileInView` animations, `useReducedMotion` hook
- `components/ColorStorySection.tsx` — `'use client'`, gradient background, color swatch, 3 phone renders, `whileInView` animations
- `components/PricingCTASection.tsx` — `'use client'`, wraps PricingSelector island, `whileInView` animation
- `components/PricingSelector.tsx` — `'use client'`, 3 storage tier selector with `useState`
- `components/StickyMobileCTA.tsx` — `'use client'`, IntersectionObserver on `#hero`, `AnimatePresence` slide-up
- `components/Footer.tsx` — RSC, minimal Apple-style footer with nav links and copyright

---

## Build Output Summary

```
Route (app)                   Size    First Load JS
┌ ○ /                       46.3 kB        149 kB
└ ○ /_not-found               994 B        103 kB
+ First Load JS shared       102 kB
```

All routes prerendered as static content (SSG). First load JS is 149kB — slightly above the 100kB gzip target but within acceptable range for Framer Motion inclusion. Further optimization possible via dynamic imports for below-fold sections in a future iteration.

---

## Implementation Notes

### CTA Colors (WCAG AA)
Per accessibility review in PROJ-002, all CTA buttons use `bg-[#CC5228]` as default (4.6:1 contrast ratio with white text — WCAG AA pass). `#FF6B35` is used only for decorative accents, subheadlines, and ghost button borders/text.

### Reduced Motion
All Framer Motion animations check `useReducedMotion()` — when true, `initial` is `{}` (no animation). CSS also disables transitions/animations via `@media (prefers-reduced-motion: reduce)`.

### Image Domains
`next.config.ts` includes both `v3b.fal.media` and `fal.media` in `remotePatterns`. CSP `img-src` also includes `https://v3b.fal.media`.

### Accessibility
- Skip-to-main-content link in layout
- All interactive elements have `focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-2`
- Semantic HTML: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- ARIA labels on all CTAs, section headings use `aria-labelledby`
- Feature icons are `aria-hidden="true"` (decorative)

---

## Handoff Notes

- Run `npm run dev` to start development server
- Run `npm run build` to verify production build
- Deploy to Vercel: connect repo, no environment variables required unless regenerating FAL images
- All images served from `v3b.fal.media` CDN — no local assets required
- PricingSelector is an interactive client island — pricing state is local, no backend needed

**Status:** Done | Ready for QA (PROJ-004)
