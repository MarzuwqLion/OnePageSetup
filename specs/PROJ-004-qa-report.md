# PROJ-004 QA Report
## iPhone 17 Pro Max — Cosmic Orange Landing Page

**Task ID:** PROJ-004
**Agent:** QA Engineer
**Status:** Pass with Issues
**Date:** 2026-03-05
**Inputs Reviewed:**
- `specs/PROJ-001-architecture.md` (Architect spec)
- `specs/PROJ-002-design.md` (Design spec)
- `specs/PROJ-003-engineer-output.md` (Engineer output)
- All component source files (code-review-based testing)

---

## Overall QA Status: Pass with Issues

---

## Summary

- All acceptance criteria from PROJ-003 pass on direct code inspection. The core page structure, CTA placement, responsive grid, animation logic, and security headers are correctly implemented.
- Three defects were identified: a minor CSP image domain gap (QA-001, Medium), the Hero section rendering order placing the price line before the CTAs in DOM flow contrary to the design spec (QA-002, Low), and the StickyMobileCTA observing only the hero entry/exit without a second observer to hide at the pricing section, as the architecture spec requires (QA-003, Low).
- No Critical or High severity blockers found. The page is deployable subject to acknowledgment of the three medium/low findings below.

---

## Tests Executed

### HIGH RISK

- **Test Case: Hero CTA above-fold visibility at 375px and 1440px**
  - Risk Level: High
  - Result: Pass
  - Notes: `HeroSection.tsx` renders the "Buy Now" anchor (`href="#pricing"`, `bg-[#CC5228]`) inside a `motion.div` that fires on mount. The price line `"From $1,199"` appears in DOM source order **after** the CTA buttons (line 50 is price, lines 55-70 are CTAs; however the visual order in the component is: headline, subheadline, tagline, image, price, CTAs). The CTA buttons are rendered after the price line in the code, which matches a below-image layout. The hero section is `min-h-screen` with `flex flex-col items-center justify-center`, so at 375px all content fits in a single column and the CTA is visually present on load. At 1440px the `xl:max-w-4xl xl:mx-auto` constraint keeps everything centered. `priority={true}` is confirmed on the hero `<Image>` (line 43).
  - Note on layout order vs. design spec: The design wireframe shows the image above the headline, but the code renders the headline first, then the image. This is a minor deviation but does not affect CTA above-fold accessibility — the CTA remains visible at 375px because the section is `min-h-screen` with flex centering. No defect raised, but noted.

- **Test Case: StickyMobileCTA IntersectionObserver, AnimatePresence, md:hidden, iOS safe area**
  - Risk Level: High
  - Result: Pass with Notes (see QA-003)
  - Notes:
    - `IntersectionObserver` targets `document.getElementById('hero')` — the hero section carries `id="hero"` (confirmed in `HeroSection.tsx` line 10).
    - `threshold: 0` is set — the bar appears as soon as any pixel of the hero exits the viewport.
    - `AnimatePresence` wraps the `motion.div` with `initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}` — correct slide-up/down behavior.
    - `md:hidden` is applied on the outermost `motion.div` (line 28 of `StickyMobileCTA.tsx`) — correctly hidden on tablet and desktop.
    - iOS safe area: `style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}` (line 29) — correct inline style fallback. This supplements the Tailwind `py-3` class.
    - Gap identified: The architecture spec (Section 3) states the bar should also hide when the user reaches the `#pricing` section ("Dismissal: hides when user reaches `#pricing` section (second IntersectionObserver)"). The implementation only disconnects/observes `#hero` entry/exit. The bar will remain visible while the user is in the pricing section. See QA-003.

- **Test Case: Pricing section has actual CTA (Buy Now) and pricing display**
  - Risk Level: High
  - Result: Pass
  - Notes: `PricingCTASection.tsx` contains `<PricingSelector />` (interactive 3-tier storage selector with prices $1,199 / $1,329 / $1,599), a primary "Buy Now" `<a>` with `bg-[#CC5228]` (line 41), and a "Learn More" ghost button. Section carries `id="pricing"` (line 12). `PricingSelector.tsx` uses `useState` with correct default `'128gb'` tier. All three tiers display price and monthly payment copy. Full pass.

---

### MEDIUM RISK

- **Test Case: Feature cards responsive grid — grid-cols-1 md:grid-cols-2 xl:grid-cols-4**
  - Risk Level: Medium
  - Result: Pass
  - Notes: `FeaturesSection.tsx` line 125: `className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-6"` — exactly matches PROJ-002 spec. `featuresContent` in `lib/content.ts` exports exactly 4 cards (camera, chip, battery, titanium). Each card is a `motion.article` with icon, title, and description. Full pass.

- **Test Case: Navbar scroll behavior — transparent to opaque, fixed top-0 z-50**
  - Risk Level: Medium
  - Result: Pass
  - Notes: `Navbar.tsx` uses `useEffect` + `window.addEventListener('scroll', ...)` with `{ passive: true }` (correct for performance) triggering at `scrollY > 60`. Transition classes: `bg-white/90 backdrop-blur-md border-b border-[#E5E5E7] shadow-sm` on scroll, `bg-transparent` at top. The header element uses `fixed top-0 left-0 right-0 z-50` (line 27). Listener is cleaned up via `removeEventListener` in the `useEffect` return. Full pass.
  - Minor observation: Architecture spec states Navbar height at mobile should be 44px (`h-11` = 44px) and desktop 52px (`md:h-[52px]`). Code uses `h-11 md:h-[52px]` — correct. However, note that the hamburger menu button is rendered with `className="hidden"` (line 79), meaning it is entirely invisible and non-interactive regardless of state. `menuOpen` state and the mobile menu overlay `AnimatePresence` block (lines 89-113) are dead code paths since the trigger button is permanently hidden. This is a Low-priority finding documented as QA-004.

- **Test Case: Typography scale — H1 text-[36px] mobile, xl:text-[64px] desktop**
  - Risk Level: Medium
  - Result: Pass
  - Notes: `HeroSection.tsx` line 23: `className="text-[36px] xl:text-[64px] font-bold text-[#1D1D1F] leading-tight tracking-tight"` — matches PROJ-002 spec exactly (36px/700 mobile, 64px/700 desktop). Subheadline: `text-[24px] xl:text-[32px] font-semibold text-[#FF6B35]` — matches spec (24px/600 mobile, 32px/600 desktop). Full pass.

- **Test Case: Color token usage — CTA default bg-[#CC5228], accent #FF6B35**
  - Risk Level: Medium
  - Result: Pass
  - Notes: All primary CTA buttons across `HeroSection.tsx`, `Navbar.tsx`, `PricingCTASection.tsx`, and `StickyMobileCTA.tsx` use `bg-[#CC5228]` as the default background (WCAG AA compliant, 4.6:1 contrast with white). `#FF6B35` is used only as: (1) subheadline text color in hero, (2) ghost button border/text, (3) SVG icon stroke fills, (4) color swatch block background in `ColorStorySection.tsx`. This is the correct division per PROJ-002 Section 7 and PROJ-003 implementation note. Full pass.

---

### LOW RISK

- **Test Case: Footer links — 4 links from footerLinks**
  - Risk Level: Low
  - Result: Pass
  - Notes: `lib/content.ts` exports `footerLinks` with 4 entries: Privacy Policy, Terms of Use, Support, Accessibility. `Footer.tsx` iterates over `footerLinks` with pipe dividers between items. Rendered inside `<nav aria-label="Footer navigation">`. Copyright text is correct: "© 2026 Sankofa. All rights reserved. iPhone is a trademark of Apple Inc." Full pass.

- **Test Case: Framer Motion viewport={{ once: true }} on all whileInView animations**
  - Risk Level: Low
  - Result: Pass
  - Notes: Reviewed all animated components:
    - `FeaturesSection.tsx`: section H2 (line 118) and each `motion.article` (line 132) both use `viewport={{ once: true, margin: '-50px' }}`.
    - `ColorStorySection.tsx`: color swatch div (line 21), H2 (line 31), description paragraph (line 43), and each phone image `motion.div` (line 57) all use `viewport={{ once: true, margin: '-50px' }}` (phone images use `margin: '-30px'`).
    - `PricingCTASection.tsx`: outer `motion.div` (line 20) uses `viewport={{ once: true, margin: '-50px' }}`.
    - All `whileInView` usages confirm `once: true`. Full pass.

- **Test Case: Section IDs for smooth scroll — id="features", id="color-story", id="pricing", id="hero"**
  - Risk Level: Low
  - Result: Pass
  - Notes:
    - `id="hero"` — `HeroSection.tsx` line 10. Confirmed.
    - `id="features"` — `FeaturesSection.tsx` line 109. Confirmed.
    - `id="color-story"` — `ColorStorySection.tsx` line 12. Confirmed.
    - `id="pricing"` — `PricingCTASection.tsx` line 12. Confirmed.
    - Navbar anchor links (#hero, #features, #color-story, #pricing) match all section IDs. Full pass.

- **Test Case: useReducedMotion — implemented in animated components**
  - Risk Level: Low
  - Result: Pass
  - Notes: `FeaturesSection.tsx` (line 105), `ColorStorySection.tsx` (line 8), and `PricingCTASection.tsx` (line 8) all import and use `useReducedMotion()` from Framer Motion. When `prefersReducedMotion` is true, `initial` is set to `{}` and `delay` is set to `0`. Additionally, `globals.css` has a `@media (prefers-reduced-motion: reduce)` block that sets `animation-duration: 0.01ms` and `transition-duration: 0.01ms` across all elements. Full pass.

---

### PERFORMANCE CHECK

- **Test Case: next.config.ts image formats — avif and webp**
  - Risk Level: Medium
  - Result: Pass
  - Notes: `next.config.ts` line 33: `formats: ['image/avif', 'image/webp']` — confirmed present.

- **Test Case: Hero image priority={true}**
  - Risk Level: High
  - Result: Pass
  - Notes: `HeroSection.tsx` line 43: `priority={true}` confirmed on the `<Image>` component. `sizes` attribute present: `"(max-width: 768px) 280px, (max-width: 1440px) 360px, 480px"`. Width and height dimensions supplied (390x844) to prevent CLS.

- **Test Case: CSP img-src covers image CDN domain**
  - Risk Level: Medium
  - Result: Fail (see QA-001)
  - Notes: Images are served from `https://v3b.fal.media/...` (confirmed in `lib/content.ts`). The CSP `img-src` in `next.config.ts` line 22 includes `https://fal.media https://v3b.fal.media https://*.vercel.app`. The subdomain `v3b.fal.media` is explicitly listed. However, the `vercel.json` (referenced in PROJ-001 and PROJ-003) does not include a CSP header — it only includes the other 5 security headers. This means if Next.js headers are not active (e.g., pure static export to a different CDN), CSP would not fire via `vercel.json`. This is belt-and-suspenders coverage gap. See QA-001.

- **Test Case: Bundle size — first load JS 149kB vs. 100kB target**
  - Risk Level: Low
  - Result: Partial (within acceptable range per Engineer note)
  - Notes: PROJ-003 build output reports first load JS of 149kB, above the Architect's 100kB gzip target. The Engineer notes this is within acceptable range for Framer Motion inclusion and suggests dynamic imports for below-fold sections as a future optimization. No dynamic import of Framer Motion was implemented in this iteration despite the Architect spec recommending it for below-fold sections. This is a non-blocking performance note.

---

## Defects Found

- **Defect ID:** QA-001
  - Severity: Medium
  - Affected Area: `next.config.ts` CSP `img-src` / `vercel.json` headers
  - Description: The `vercel.json` security headers configuration (per PROJ-003 file list and PROJ-001 architecture spec) does not include a `Content-Security-Policy` header. The CSP is only set in `next.config.ts`. If the site is served via Vercel's edge with `vercel.json` overriding Next.js headers, the CSP protecting against image hotlinking from untrusted domains would be absent. Additionally, the PROJ-001 architecture spec CSP example shows `img-src 'self' data: https://fal.media https://*.vercel.app` without `v3b.fal.media`, while the actual `next.config.ts` correctly adds `https://v3b.fal.media`. The spec and implementation are inconsistent on this point.
  - Expected Behavior: CSP `img-src` should be present in both `next.config.ts` and `vercel.json`, and both should include `https://v3b.fal.media` explicitly (or use `https://*.fal.media` wildcard).
  - Evidence: `next.config.ts` line 22 includes `v3b.fal.media`; `vercel.json` (referenced in PROJ-003 file list) does not contain a CSP header per the PROJ-001 appendix template.
  - Suggested Owner: Software Engineer

- **Defect ID:** QA-002
  - Severity: Low
  - Affected Area: `HeroSection.tsx` — visual DOM order vs. design spec
  - Description: The design spec (PROJ-002 Section 4.2, mobile wireframe) shows the product image displayed at the top of the hero, above the headline text. The implemented code places the headline (H1), subheadline, and tagline **before** the image in DOM order (lines 20-34 headline/sub/tagline, then lines 37-47 image). This means screen readers and keyboard users encounter the text before the image, which is semantically correct, but it deviates from the visual design wireframe layout where the image is the first element seen. On the desktop mockup, the spec also shows text-first, so desktop is consistent. The mobile wireframe deviation is minor but worth flagging.
  - Expected Behavior: Per PROJ-002 mobile wireframe, image should appear visually first in the hero, followed by headline, subheadline, tagline, price, and CTAs. If text-first DOM order is intentional for SEO and accessibility reasons (which is a valid choice), this should be explicitly documented as an intentional deviation.
  - Evidence: `HeroSection.tsx` lines 20-70 — headline renders before image element. PROJ-002 Section 4.2 mobile wireframe shows image-first layout.
  - Suggested Owner: Software Engineer (confirm intent; update design spec note if intentional)

- **Defect ID:** QA-003
  - Severity: Low
  - Affected Area: `StickyMobileCTA.tsx` — missing second IntersectionObserver for pricing section
  - Description: The architecture spec (PROJ-001 Section 3, StickyMobileCTA) specifies: "Dismissal: Not dismissible; hides when user reaches `#pricing` section (second `IntersectionObserver`)." The current implementation only sets up one `IntersectionObserver` that shows the bar when `#hero` exits the viewport and hides it when `#hero` re-enters. There is no second observer on `#pricing`. As a result, the sticky bar remains visible when the user is actively viewing the pricing section — overlapping the existing pricing CTA content and potentially creating a confusing duplicate "Buy Now" UI on mobile.
  - Expected Behavior: A second `IntersectionObserver` should be set up on `document.getElementById('pricing')`. When `#pricing` is intersecting, `visible` should be set to `false` to dismiss the sticky bar. When `#pricing` exits, if `#hero` is also not intersecting, the bar should re-appear.
  - Evidence: `StickyMobileCTA.tsx` lines 9-18 — only one observer on `#hero`. No observer on `#pricing`.
  - Suggested Owner: Software Engineer

- **Defect ID:** QA-004
  - Severity: Low
  - Affected Area: `Navbar.tsx` — dead code: hidden hamburger button, unreachable mobile menu overlay
  - Description: `Navbar.tsx` renders a hamburger `<button>` with `className="hidden"` (line 79), meaning it is permanently invisible and cannot be interacted with. The `menuOpen` state and the `AnimatePresence` mobile menu overlay (lines 89-113) are therefore dead code — the menu can never be opened. Instead, the mobile layout shows a "Buy Now" CTA pill directly in the navbar (lines 69-75), which is a valid replacement for the hamburger. However, the `menuOpen` state variable, the `setMenuOpen` handler, and the entire `AnimatePresence` overlay block remain in the codebase and add unused bundle weight.
  - Expected Behavior: Either (a) remove the dead hamburger button, `menuOpen` state, and mobile menu overlay since the mobile CTA pill is the chosen replacement; or (b) make the hamburger button visible if the mobile menu overlay is intended to be used. The architecture spec described a hamburger menu, but the implementation chose a CTA pill instead — this design decision should be reflected in a cleanup of the dead code.
  - Evidence: `Navbar.tsx` line 79: `className="hidden"` on the hamburger button. Lines 89-113: unreachable `AnimatePresence` menu block.
  - Suggested Owner: Software Engineer

---

## Acceptance Criteria Check

Criteria from PROJ-003 Engineer self-assessment vs. QA independent verification:

1. `npm run dev` / `npm run build` starts without errors — **Pass** (confirmed by PROJ-003 build output; no TypeScript or ESLint errors reported; file structure and type imports are consistent across all reviewed files)

2. All 6 sections: Navbar, Hero, Features (4 cards), ColorStory, Pricing+CTA, Footer — **Pass** (all 6 sections confirmed in `app/page.tsx`; `StickyMobileCTA` also present as a 7th portal component outside `<main>`)

3. StickyMobileCTA: `'use client'`, IntersectionObserver, `md:hidden`, slides up — **Pass with Notes** (all four sub-criteria confirmed; QA-003 raises that the second observer for hiding at `#pricing` is missing per architecture spec, but the primary trigger logic is correct)

4. Framer Motion `whileInView` with `once: true` on feature cards and sections — **Pass** (all `whileInView` animations confirmed to have `viewport={{ once: true }}` in FeaturesSection, ColorStorySection, and PricingCTASection)

5. Design tokens from PROJ-002 in `tailwind.config.ts` (Cosmic Orange palette) — **Pass** (color values `#CC5228`, `#FF6B35`, `#B34820`, `#1D1D1F`, `#6E6E73`, `#F5F5F7` are used consistently via inline Tailwind arbitrary values throughout all components; PROJ-001 architecture spec shows `tailwind.config.ts` token extension with `cosmic.orange`, `cosmic.orange-dark`, and `apple.*` tokens)

6. `next.config.ts` security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options) — **Pass** (all 6 headers confirmed in `next.config.ts`; QA-001 raises a medium-severity gap regarding `vercel.json` not including CSP)

7. Mobile-first responsive: 1-col 375px, 4-col features at 1440px — **Pass** (`grid-cols-1 md:grid-cols-2 xl:grid-cols-4` confirmed in `FeaturesSection.tsx` line 125; hero single-column at all breakpoints confirmed)

8. Hero image `priority={true}`, others lazy-loaded — **Pass** (`HeroSection.tsx` line 43 confirmed; `ColorStorySection.tsx` phone images do not use `priority` — correctly lazy-loaded)

9. `lib/content.ts` contains all static copy — **Pass** (heroContent, featuresContent, colorStoryContent, pricingContent, footerLinks all present and correctly typed against `lib/types.ts`)

---

## Non-Functional Observations

### Performance / LCP Strategy

- Hero image `priority={true}` is set correctly, which injects a `<link rel="preload">` in `<head>` via Next.js. This is the primary LCP optimization.
- The hero image is served from `https://v3b.fal.media` — an external CDN. Image optimization (WebP/AVIF conversion) occurs via Vercel's Image Optimization API when the `<Image>` component is used with `formats: ['image/avif', 'image/webp']` in `next.config.ts`. This is correctly configured.
- Images in `ColorStorySection.tsx` (3 phone renders) all point to the same source URL for items 0 and 2 (`z3vl7g8Eu4zlyk8RPLu14_CLPutr0E.png`), with only item 1 using a different image (`MnGOHaGHyy4NoaNJpcvsy_XogwTTki.png`). This means two of the three "different angle" renders in the color story show the identical image. This is a content accuracy issue rather than a code defect, but worth noting for review.
- First Load JS is 149kB vs. the Architect's 100kB gzip target. Framer Motion is the primary contributor. No dynamic imports were applied to below-fold animated sections (FeaturesSection, ColorStorySection, PricingCTASection) as the Architect spec suggested. This is a performance optimization opportunity for a follow-up iteration.

### CLS Risk

- All `<Image>` components supply explicit `width` and `height` attributes. Hero image: 390x844. Color story images: 160x346. No `fill` layout is used. CLS risk from images is low.
- Framer Motion animations use `opacity` and `y` (transform: translateY) only — no layout-affecting properties. CLS impact from animations is negligible.

### Reliability / Resilience

- The `IntersectionObserver` in `StickyMobileCTA.tsx` includes a guard: `if (!hero) return` (line 11). If `#hero` is not found in the DOM, the observer simply does not initialize — no error thrown. This is correct defensive coding.
- `PricingSelector.tsx` uses `storageTiers.find(t => t.id === selected) ?? storageTiers[0]` as a fallback — if state somehow becomes invalid, the first tier is shown. Safe.
- No error boundaries are implemented. For a static marketing page with no async data fetching, this is acceptable.

### Accessibility

- Semantic HTML is fully implemented: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`.
- Skip-to-main-content link is present in `layout.tsx` and styled in `globals.css` (reveals on focus via `top: 0`).
- All CTA `<a>` elements have `aria-label` attributes. Feature card `<article>` elements have `aria-label="Feature: [title]"`. Section headings use `aria-labelledby`.
- SVG icons in feature cards are `aria-hidden="true"` (decorative).
- `PricingSelector.tsx` uses `role="radiogroup"` and `role="radio"` with `aria-checked` — correct ARIA pattern for a storage tier selector.
- The hamburger button in `Navbar.tsx` has `aria-expanded={menuOpen}` but is `className="hidden"` — since it is not rendered to the accessibility tree (Tailwind `hidden` = `display: none`, which removes from AOM), this does not create an orphaned ARIA relationship. Low risk.

### Security

- All 6 required security headers are present in `next.config.ts`: X-Frame-Options (DENY), X-Content-Type-Options (nosniff), Referrer-Policy (strict-origin-when-cross-origin), HSTS (max-age=63072000; includeSubDomains; preload), Permissions-Policy, and CSP.
- CSP `script-src` includes `'unsafe-inline'` — required for Next.js and Framer Motion inline styles/scripts. This is an accepted tradeoff noted in PROJ-001.
- No `FAL_API_KEY` or other secrets appear in any client-facing component or lib file. All image URLs are static CDN URLs with no API key parameters.
- `connect-src 'self'` in CSP correctly prevents unauthorized XHR/fetch calls.

---

## Risks and Recommendations

1. **QA-001 (Medium) — CSP gap in vercel.json:** Verify that `vercel.json` either (a) includes a full CSP header matching `next.config.ts`, or (b) does not override `next.config.ts` headers in the Vercel deployment context. If Vercel merges both header sources, the current setup is safe. If `vercel.json` headers override Next.js headers for the `/(.*)`  pattern, CSP would be absent at the edge. Confirm with a `curl -I` on the deployed URL and check for `Content-Security-Policy` in the response. Route to Software Engineer to add CSP to `vercel.json`.

2. **QA-003 (Low) — StickyMobileCTA visible over pricing section:** The sticky bar overlapping the pricing section's own "Buy Now" CTA creates a redundant UI on mobile that may confuse users during the conversion moment. Recommend adding a second `IntersectionObserver` on `#pricing` to hide the bar when pricing is in view. This is a low-effort fix and was called out in the architecture spec. Route to Software Engineer.

3. **QA-004 (Low) — Dead hamburger code in Navbar:** Remove the hidden hamburger button, `menuOpen` state, and unreachable `AnimatePresence` overlay from `Navbar.tsx` to reduce bundle size and simplify the component. The mobile CTA pill pattern is cleaner and already functional. Route to Software Engineer for cleanup.

4. **Performance gap — First Load JS 149kB vs. 100kB target:** Consider applying `next/dynamic` with `{ ssr: false }` to `FeaturesSection`, `ColorStorySection`, and `PricingCTASection` to code-split Framer Motion into a separate chunk loaded only after the hero renders. This was recommended in PROJ-001 Section 5 but was not implemented. Not a deployment blocker but should be scheduled for the next iteration.

5. **Content accuracy — Duplicate color story image:** Two of the three phone renders in `ColorStorySection` point to the same image URL. If visually distinct angles were intended (per design spec Section 4.4: "front view", "angled view", "side profile"), a third unique FAL image should be generated and its URL placed in `colorStoryContent.images[2]` in `lib/content.ts`. Route to Product/Engineer to regenerate if needed.

6. **Automation recommendation:** Add Playwright E2E tests for the two highest-risk user journeys:
   - Hero CTA visible and clickable at 375px viewport, navigates to `#pricing`.
   - StickyMobileCTA appears after scrolling past hero, hidden at page top.
   These would catch regressions in the IntersectionObserver logic and CTA placement on future changes.

---

**Handoff Status:** Pass with Issues — 0 Critical, 0 High, 1 Medium (QA-001), 3 Low (QA-002, QA-003, QA-004) defects identified. No deployment blockers. Recommend Security Reviewer proceeds in parallel with defect resolution.

**Task ID:** PROJ-004 | **Status:** Done | **Next:** Security Reviewer (PROJ-005)
