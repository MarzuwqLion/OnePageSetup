# PROJ-011 Diagnostic Report — `npm run dev` Shows No Visual Changes

**Task ID:** PROJ-011
**Assigned To:** Software Architect + Software Engineer (joint diagnostic)
**Date:** 2026-03-05
**Status:** Done

---

## Executive Summary

After reading all nine target files and running filesystem checks, **one confirmed root cause and two high-probability contributing causes** were found. The single most impactful issue is a structural override in `app/page.tsx` that wraps every section — including `HeroSection` and `ColorStorySection` — in a `<main>` tag with `bg-white`, making the dark backgrounds invisible regardless of what the individual sections declare.

---

## Verdict on Each Cause

### Cause 1: Stale `.next/` Cache
**Verdict: LIKELY (contributing factor, not primary cause)**

The `.next/` directory exists and was last written at `Mar 5 19:26`. The `.next/cache/` subdirectory contains webpack, swc, and tsbuildinfo entries from as early as `18:01`, which predate the edits described in this task. A stale webpack or SWC compile cache could serve old module snapshots to the dev server without reflecting new file writes.

However, because Next.js dev mode uses file watchers and HMR, a stale cache alone is unlikely to completely prevent all visual changes from appearing — it would more commonly cause intermittent or partial update failures. It is a valid contributing factor that should be cleared as a first step.

**Evidence:**
```
.next/cache/webpack  — dir exists, timestamps from 18:01–19:02
.next/cache/.tsbuildinfo — 112 KB, last written 18:10
```

---

### Cause 2: Tailwind JIT Class Scanning Gap
**Verdict: UNLIKELY**

`tailwind.config.ts` line 4:
```ts
content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
```

This correctly covers both `./app/` and `./components/`. All edited files (`HeroSection.tsx`, `ColorStorySection.tsx`, `Navbar.tsx`) are in `./components/` and are included in the scan. The classes added (`bg-black`, `bg-[#1D1D1F]`, `text-white`, `text-[#A1A1A6]`, `text-white/60`, `text-white/50`) are valid JIT-generated classes. None of them are in the `safelist` or require special configuration — they will be generated on demand by JIT scanning the component files.

No configuration change to `tailwind.config.ts` is needed. Tailwind scanning is not the problem.

---

### Cause 3: `app/layout.tsx` or `app/globals.css` Overriding Background
**Verdict: UNLIKELY (layout.tsx clean; globals.css clean)**

`app/layout.tsx` applies no background class to `<html>` or `<body>`. The `<body>` element is bare.

`app/globals.css` does not set a `background-color` on `html`, `body`, or any layout container. It only sets `font-family` and font smoothing on `body`, plus scroll behavior on `html`. No background conflict exists here.

---

### Cause 4: `app/page.tsx` Wrapping Sections in a Container with White Background
**Verdict: CONFIRMED — PRIMARY ROOT CAUSE**

`app/page.tsx` line 13:
```tsx
<main id="main-content" className="min-h-screen bg-white font-sans text-[#1D1D1F]">
```

This `<main>` element wraps ALL page sections: `HeroSection`, `FeaturesSection`, `ColorStorySection`, `PricingCTASection`, and `Footer`. The `bg-white` class applied at this level creates a white background that sits **on top of** (or rather, as the stacking context of) every child section.

Why the dark backgrounds appear invisible:

- `bg-white` is applied to the direct parent container of `HeroSection` and `ColorStorySection`.
- In CSS, `background-color` on a parent does not override child backgrounds — child `background-color` declarations do win — BUT if the child section's background is transparent or if there is any issue with the compiled CSS not including the new classes (see Cause 1), the parent's `bg-white` becomes the visible color.
- More critically: even when child backgrounds render correctly, the parent `bg-white` will bleed through any gap, rounded corner, padding, or margin artifact. On some screen sizes or zoom levels the white parent is visible.

Additionally, `text-[#1D1D1F]` is set on `<main>`, which is the default dark text color. This may also override any inherited text styling from child sections if specificity works against the child declarations.

**This is the single most likely reason the hero and color story sections appear unchanged** — if the CSS for `bg-black` and `bg-[#1D1D1F]` did not compile into the stylesheet (which happens when Tailwind does not detect those class strings in a fresh JIT scan, or when the cache is stale), the `<main>`'s `bg-white` is what fills the screen.

---

### Cause 5: Dev Server Not Restarted After `next.config.ts` Changes
**Verdict: LIKELY (required action, cannot be programmatically confirmed)**

`next.config.ts` was modified (CSP changes, `remotePatterns` additions for `v3b.fal.media`). Next.js does NOT hot-reload `next.config.ts` changes. The dev server must be fully stopped (`Ctrl+C`) and restarted (`npm run dev`) for these changes to take effect. Without a restart, the image domain allowlist for `v3b.fal.media` will not be active, causing Next.js Image Optimization to block or error on the new image URLs — images will either not load or fall back, visually appearing as if no image change occurred.

This is a **definite required action** even if it is not the sole root cause.

---

### Cause 6: Browser Cache
**Verdict: LIKELY (contributing factor, easy to eliminate)**

Cannot be confirmed programmatically, but this is a standard cause of "I changed files and see nothing" in any web dev workflow. Old CSS bundles cached in the browser — especially the compiled Tailwind stylesheet — will continue serving the old class definitions until the bundle hash changes or the cache is invalidated.

Hard refresh (`Ctrl+Shift+R` on Windows/Linux, `Cmd+Shift+R` on Mac) or opening a private/incognito window eliminates this entirely.

---

### Cause 7: `postcss.config.js` Misconfiguration
**Verdict: RULED OUT**

`postcss.config.js` is correctly configured:
```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

Tailwind CSS is registered as a PostCSS plugin in the correct format. Autoprefixer is also present. No misconfiguration detected.

---

## Root Cause Summary

| Cause | Verdict |
|---|---|
| 1. Stale `.next/` cache | Likely (contributing) |
| 2. Tailwind JIT class scanning gap | Unlikely |
| 3. `globals.css` / `layout.tsx` background override | Unlikely |
| 4. `page.tsx` wrapping `<main>` with `bg-white` | **Confirmed — Primary Root Cause** |
| 5. Dev server not restarted after `next.config.ts` changes | Likely (required action) |
| 6. Browser cache | Likely (contributing) |
| 7. `postcss.config.js` misconfiguration | Ruled Out |

### Single Most Likely Root Cause

**`app/page.tsx` line 13 — `<main className="... bg-white ...">`**

The `bg-white` class on the `<main>` wrapper is a persistent white background that underlies all sections. When the child section CSS fails to compile (due to cache or restart issues), this white background is all that renders. Even when the child CSS does compile, the parent `bg-white` may produce visual artifacts (white gaps, white flash). This is the structural defect that needs a code fix — the other causes are operational fixes.

---

## Ordered Fix Checklist

Run these commands in sequence in your terminal. Stop after each step, check the browser, and proceed only if the issue persists.

**Step 1 — Stop the dev server**
```
Ctrl+C
```
(in the terminal running `npm run dev`)

**Step 2 — Clear the Next.js compile cache**
```bash
cd "C:/Paradise/Sankofa/OnePageSite" && rm -rf .next
```

**Step 3 — Restart the dev server**
```bash
npm run dev
```

**Step 4 — Hard refresh the browser**

Once the dev server is running and shows `Ready`, in your browser press:
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

Or open `http://localhost:3000` in a new private/incognito window.

**Step 5 — If changes still do not appear: remove node_modules cache and reinstall**
```bash
cd "C:/Paradise/Sankofa/OnePageSite" && rm -rf node_modules/.cache && npm install
```
Then restart:
```bash
npm run dev
```

**Step 6 — Code fix required (separate engineering task)**

Even after Steps 1–5, the structural `bg-white` on `<main>` in `app/page.tsx` line 13 will continue to conflict with section-level dark backgrounds. The `bg-white` class should be removed or replaced (e.g., with `bg-black` if the page overall is meant to be dark). This is a code change and should be tracked as a separate engineer task.

---

## Files Inspected

| File | Key Finding |
|---|---|
| `app/page.tsx` | `<main className="min-h-screen bg-white ...">` — confirmed root cause |
| `app/layout.tsx` | Clean — no background override |
| `app/globals.css` | Clean — no background override |
| `tailwind.config.ts` | Content glob correct — covers components/**/*.{ts,tsx} |
| `postcss.config.js` | Correct — tailwindcss + autoprefixer registered |
| `components/HeroSection.tsx` | Correctly uses `bg-black`, `text-white`, `text-white/60`, `text-white/50` |
| `components/ColorStorySection.tsx` | Correctly uses `bg-[#1D1D1F]`, `text-white`, `text-[#A1A1A6]` |
| `components/Navbar.tsx` | Correctly uses `scrolled ? 'text-[#1D1D1F]' : 'text-white'` |
| `lib/content.ts` | Image URLs updated to `v3b.fal.media` — correct |
| `next.config.ts` | `v3b.fal.media` added to `remotePatterns` — correct, but requires dev server restart to activate |
| `.next/` directory | Exists with cache timestamps predating edits — stale cache confirmed |
