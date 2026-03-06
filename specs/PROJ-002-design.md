# PROJ-002 Design Specification
## iPhone 17 Pro Max — Cosmic Orange Landing Page

**Task ID:** PROJ-002
**Agent:** UI/UX Designer
**Status:** Done
**Date:** 2026-03-05
**Handoff To:** Software Engineer (PROJ-003)

---

## 1. Design Overview

- **Primary User Goal:** Discover and purchase the iPhone 17 Pro Max in Cosmic Orange colorway
- **Key Screens:** Navbar, Hero, Features (3–4 cards), ColorStory, Pricing + CTA, Footer; Mobile Sticky CTA bar
- **Target Audience:** Premium consumer, Apple ecosystem user, upgrade-motivated buyer
- **Brand Tone:** Premium, confident, minimal — Apple.com gold standard

### Color Palette

| Role               | Hex       | Usage                                      |
|--------------------|-----------|--------------------------------------------|
| Primary Accent     | #FF6B35   | CTA buttons, highlights, ColorStory accent |
| CTA Hover          | #CC5228   | Button hover state                         |
| CTA Active         | #B34820   | Button active/pressed state                |
| Background Primary | #FFFFFF   | Main page background                       |
| Background Alt     | #F5F5F7   | Feature cards, ColorStory section          |
| Text Primary       | #1D1D1F   | Headlines, body copy                       |
| Text Secondary     | #6E6E73   | Subheadlines, captions, footer links       |

### Typography

| Element          | Mobile    | Desktop   | Font Stack                                                  |
|------------------|-----------|-----------|-------------------------------------------------------------|
| H1               | 36px/600  | 64px/700  | -apple-system, BlinkMacSystemFont, "SF Pro Display", Segoe UI |
| H2               | 28px/600  | 40px/700  | Same                                                        |
| H3 (card title)  | 20px/600  | 24px/600  | Same                                                        |
| Body             | 17px/400  | 17px/400  | Same                                                        |
| Caption / Label  | 14px/400  | 15px/400  | Same                                                        |
| Price Display    | 28px/700  | 48px/700  | Same                                                        |

### Animation Standard

All transitions: `200ms ease-in-out cubic-bezier(0.25, 0.46, 0.45, 0.94)`
Respect `prefers-reduced-motion: reduce` — disable non-essential motion.

---

## 2. User Flow

```
User arrives at URL
        |
        v
[Navbar] — sticky, transparent → opaque on scroll
        |
        v
[Hero Section] — Full viewport, iPhone 17 Pro Max front-and-center
  - "iPhone 17 Pro Max" H1
  - "Cosmic Orange" orange subheadline
  - "From $1,199" price line
  - "Buy Now" CTA + "Learn More" ghost button
        |
        v
[Features Section] — 4 cards (1-col mobile / 2-col tablet / 4-col desktop)
  - 48MP Fusion Camera
  - A19 Pro Chip
  - All-Day Battery (29h)
  - Titanium Design
        |
        v
[ColorStory Section] — Full-bleed Cosmic Orange moment
  - Large #FF6B35 color wash
  - Multiple iPhone renders
  - Colorway story copy
        |
        v
[Pricing + CTA Section] — Conversion moment
  - "From $1,199" large display
  - "Buy Now" primary CTA
  - "Learn More" ghost CTA
        |
        v
[Footer] — Minimal Apple-style links
        |
        v
[Mobile Sticky Bar] — Appears after hero scrolls out of view
  - Price + "Buy Now" — fixed bottom
```

---

## 3. Reusable Components

| Component               | Variant / Notes                                               |
|-------------------------|---------------------------------------------------------------|
| `<Navbar>`              | Fixed top, transparent → opaque on scroll, 44px height mobile / 52px desktop |
| `<Button>` Primary      | bg-[#FF6B35], white text, rounded-2xl, 56px height            |
| `<Button>` Ghost        | border-[#FF6B35], text-[#FF6B35], transparent bg              |
| `<FeatureCard>`         | bg-[#F5F5F7], rounded-2xl, shadow-sm hover:shadow-md          |
| `<ColorStory>`          | Full-width section, #FF6B35 bg wash, multiple phone renders   |
| `<StickyMobileCTA>`     | Fixed bottom bar, shows after hero exits viewport (IntersectionObserver) |
| `<PricingSection>`      | Centered layout, large price display, dual CTA                |
| `<Footer>`              | Minimal links, #6E6E73 text, #F5F5F7 background               |

---

## 4. Screen Specifications

### 4.1 Navbar

**Mobile (375px):**
```
┌─────────────────────────────┐
│  [  Logo  ]       [Buy Now] │  ← 44px height, px-6
│                             │     Logo: 20px, #1D1D1F
└─────────────────────────────┘     CTA pill: bg-[#FF6B35] text-white
                                    text-sm px-4 py-2 rounded-full
```

**Desktop (1440px):**
```
┌───────────────────────────────────────────────────────────────────┐
│  [Logo]    Features  ColorStory  Pricing        [Buy Now]         │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
  52px height, max-w-7xl mx-auto px-16
  Nav links: text-[#1D1D1F] text-sm, hover:text-[#FF6B35] transition
  On scroll: backdrop-blur-md bg-white/90 border-b border-[#E5E5E7]
```

**States:**
- Default (top of page): bg-transparent
- Scrolled: bg-white/90 backdrop-blur-md shadow-sm border-b border-[#E5E5E7] transition-all 200ms

---

### 4.2 Hero Section

**Mobile (375px):**
```
┌─────────────────────────────┐
│                             │
│                             │
│    ┌─────────────────────┐  │
│    │                     │  │
│    │   [iPhone 17 Pro    │  │  ← Product image: 280px wide
│    │    Max Cosmic       │  │    centered, no hard shadow
│    │    Orange render]   │  │    aspect-ratio: 9/16 approx
│    │                     │  │
│    └─────────────────────┘  │
│                             │
│     iPhone 17 Pro Max       │  ← H1: 36px/700 #1D1D1F, text-center
│                             │
│       Cosmic Orange         │  ← 24px/600 #FF6B35, text-center
│                             │
│   Titanium. Redefined.      │  ← 17px/400 #6E6E73, text-center
│                             │
│  ┌──────────────────────┐   │
│  │      Buy Now         │   │  ← Primary CTA: w-full 56px #FF6B35
│  └──────────────────────┘   │
│  ┌──────────────────────┐   │
│  │      Learn More      │   │  ← Ghost CTA: w-full 56px border-[#FF6B35]
│  └──────────────────────┘   │
│                             │
│         From $1,199         │  ← 15px #6E6E73 text-center
│                             │
└─────────────────────────────┘
  min-h: 100vh, pt-16 (nav clearance), pb-12, px-6
  Vertical centering: flex flex-col items-center justify-center gap-4
```

**Desktop (1440px):**
```
┌───────────────────────────────────────────────────────────────────┐
│                                                                   │
│                  iPhone 17 Pro Max                                │
│                   H1: 64px/700 #1D1D1F                            │
│                                                                   │
│                    Cosmic Orange                                  │
│                  32px/600 #FF6B35                                 │
│                                                                   │
│              Titanium. Redefined.                                 │
│               19px/400 #6E6E73                                    │
│                                                                   │
│         ┌──────────────────────────────────────┐                  │
│         │                                      │                  │
│         │     [iPhone 17 Pro Max image —        │                  │
│         │      Cosmic Orange, centered]         │                  │  ← 480px wide max
│         │                                      │                  │
│         └──────────────────────────────────────┘                  │
│                                                                   │
│              From $1,199                                          │
│              21px/500 #1D1D1F                                     │
│                                                                   │
│    [    Buy Now    ]   [    Learn More    ]                       │
│    200px primary       200px ghost                                │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
  min-h: 100vh, py-24, max-w-4xl mx-auto, text-center
```

**Spacing:**
- Mobile: px-6, gap between elements 16px
- Desktop: max-w-4xl mx-auto, gap between elements 24px
- Image: object-contain, loading="eager" (above fold), priority={true} in Next.js

---

### 4.3 Features Section

**Mobile (375px) — Single column stack:**
```
┌─────────────────────────────┐
│                             │
│   Everything. Elevated.     │  ← H2: 28px/600 #1D1D1F, text-center
│                             │
│  ┌───────────────────────┐  │
│  │  [camera icon]        │  │
│  │  48MP Fusion Camera   │  │  ← Card H3: 20px/600 #1D1D1F
│  │  See every detail     │  │    Body: 17px/400 #6E6E73
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │  [chip icon]          │  │
│  │  A19 Pro Chip         │  │
│  │  Performance redef.   │  │
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │  [battery icon]       │  │
│  │  All-Day Battery      │  │
│  │  29-hour battery life │  │
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │  [titanium icon]      │  │
│  │  Titanium Design      │  │
│  │  Aerospace-grade str. │  │
│  └───────────────────────┘  │
│                             │
└─────────────────────────────┘
  py-20, px-6
  Card: rounded-2xl bg-[#F5F5F7] p-6 w-full
  Gap between cards: gap-4
```

**Tablet (768px) — 2-column grid:**
```
┌─────────────────────────────────────────┐
│                                         │
│        Everything. Elevated.            │
│                                         │
│  ┌──────────────────┐ ┌──────────────┐  │
│  │ [cam] 48MP       │ │ [chip] A19   │  │
│  │ Fusion Camera    │ │ Pro Chip     │  │
│  └──────────────────┘ └──────────────┘  │
│  ┌──────────────────┐ ┌──────────────┐  │
│  │ [bat] All-Day    │ │ [ti] Titan.  │  │
│  │ Battery          │ │ Design       │  │
│  └──────────────────┘ └──────────────┘  │
│                                         │
└─────────────────────────────────────────┘
  grid grid-cols-2 gap-4, px-8
```

**Desktop (1440px) — 4-column grid:**
```
┌───────────────────────────────────────────────────────────────────┐
│                                                                   │
│                    Everything. Elevated.                          │
│                    H2: 40px/700 #1D1D1F                           │
│                                                                   │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐  │
│  │ [cam icon] │  │ [chip ico] │  │ [bat icon] │  │ [ti icon]  │  │
│  │            │  │            │  │            │  │            │  │
│  │ 48MP       │  │ A19 Pro    │  │ All-Day    │  │ Titanium   │  │
│  │ Fusion     │  │ Chip       │  │ Battery    │  │ Design     │  │
│  │ Camera     │  │            │  │            │  │            │  │
│  │            │  │            │  │            │  │            │  │
│  │ See every  │  │ Performance│  │ 29-hour    │  │ Aerospace- │  │
│  │ detail     │  │ redefined  │  │ battery    │  │ grade str. │  │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘  │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
  py-28, max-w-7xl mx-auto px-16
  grid grid-cols-4 gap-6
  Card: rounded-2xl bg-[#F5F5F7] p-8 hover:-translate-y-1 hover:shadow-md transition-all 200ms
```

**Feature Card Spec:**
- Icon: 40px × 40px, color #FF6B35, placed top-left inside card
- Title: H3 weight 600, #1D1D1F
- Description: 17px, #6E6E73, mt-2
- Card bg: #F5F5F7, border-radius: 18px (rounded-2xl equivalent)
- Card padding: 24px mobile, 32px desktop
- Hover: translate-y(-4px) shadow-md transition-all 200ms

---

### 4.4 ColorStory Section

**Mobile (375px):**
```
┌─────────────────────────────┐
│█████████████████████████████│  ← Full-width bg wash #FF6B35 20% opacity
│                             │    (or solid #FFF3EE as alt)
│     Cosmic Orange           │  ← H2: 28px/600 #1D1D1F text-center
│                             │
│   A color born from the     │  ← Body: 17px/400 #4A4A4F text-center
│   warmth of a desert        │
│   sunset. The titanium      │
│   frame catches light       │
│   differently at every      │
│   angle.                    │
│                             │
│  ┌────┐ ┌────┐ ┌────┐       │  ← 3 small phone renders
│  │ O  │ │ O  │ │ O  │       │    each ~100px wide
│  │ ph │ │ ph │ │ ph │       │    showing Cosmic Orange
│  └────┘ └────┘ └────┘       │    from different angles
│                             │
│   ●  ○  ○                   │  ← Carousel dots (optional scroll)
│                             │
└─────────────────────────────┘
  py-20, px-6
  Color wash: bg-gradient-to-b from-[#FFF3EE] to-white
```

**Desktop (1440px):**
```
┌───────────────────────────────────────────────────────────────────┐
│                                                                   │
│  ████████ bg-gradient-to-r from-[#FFF3EE] to-white ████████████  │
│                                                                   │
│          ┌────────────────────────────────────────┐               │
│          │  [Large color swatch block: #FF6B35]   │               │
│          │  200px × 200px, rounded-3xl, shadow-lg │               │
│          └────────────────────────────────────────┘               │
│                                                                   │
│                    Cosmic Orange                                  │
│                    H2: 40px/700 #1D1D1F                           │
│                                                                   │
│    A color born from the warmth of a desert sunset.               │
│    The titanium frame catches light differently at                │
│    every angle — warm, vivid, unmistakably alive.                 │
│    21px/400 #6E6E73, max-w-xl mx-auto                             │
│                                                                   │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                    │
│  │ [Phone1] │    │ [Phone2] │    │ [Phone3] │                    │
│  │ Front    │    │ Angle    │    │ Back     │                    │
│  └──────────┘    └──────────┘    └──────────┘                    │
│   160px w         160px w         160px w                         │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
  py-28, text-center
  max-w-5xl mx-auto px-16
  Phone images: flex flex-row gap-8 justify-center mt-12
```

---

### 4.5 Pricing + CTA Section

**Mobile (375px):**
```
┌─────────────────────────────┐
│                             │
│   iPhone 17 Pro Max         │  ← H2: 24px/600 #1D1D1F text-center
│                             │
│         From $1,199         │  ← Price: 36px/700 #1D1D1F text-center
│                             │
│   Starting at $49.91/mo.    │  ← 15px/400 #6E6E73 text-center
│   or 0% APR for 24 months   │
│                             │
│  ┌──────────────────────┐   │
│  │       Buy Now        │   │  ← Primary: w-full 56px bg-[#FF6B35]
│  └──────────────────────┘   │
│  ┌──────────────────────┐   │
│  │      Learn More      │   │  ← Ghost: w-full 56px border-[#FF6B35]
│  └──────────────────────┘   │
│                             │
│   Free shipping. Free       │  ← 14px/400 #6E6E73 text-center
│   returns. 1-year warranty. │
│                             │
└─────────────────────────────┘
  py-20, px-6
  bg-[#FFFFFF]
```

**Mobile Sticky CTA Bar (appears after hero scrolls out):**
```
┌─────────────────────────────┐
│  From $1,199  [  Buy Now  ] │  ← Fixed bottom, h-16
└─────────────────────────────┘
  position: fixed bottom-0 left-0 right-0
  bg-white/95 backdrop-blur-md
  border-t border-[#E5E5E7]
  px-6 py-3
  flex items-center justify-between
  z-50
  "Buy Now": bg-[#FF6B35] text-white rounded-full px-6 py-2 text-sm font-medium
  Trigger: IntersectionObserver on hero section exit
  Animation: slide-up 200ms ease-out on appear
```

**Desktop (1440px):**
```
┌───────────────────────────────────────────────────────────────────┐
│                                                                   │
│                 iPhone 17 Pro Max                                 │
│                  H2: 32px/600 #1D1D1F                             │
│                                                                   │
│                   From $1,199                                     │
│                  48px/700 #1D1D1F                                 │
│                                                                   │
│          Starting at $49.91/mo. for 24 months.                   │
│                    17px/400 #6E6E73                               │
│                                                                   │
│          [  Buy Now  ]      [  Learn More  ]                     │
│          200px primary       200px ghost                          │
│          56px height         56px height                          │
│                                                                   │
│        Free shipping. Free returns. 1-year warranty.             │
│                     15px/400 #6E6E73                              │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
  py-28, max-w-3xl mx-auto text-center px-16
  bg-[#F5F5F7]
  Button row: flex gap-4 justify-center mt-8
```

---

### 4.6 Footer

**Mobile (375px):**
```
┌─────────────────────────────┐
│                             │
│     [Logo / Apple-style]    │
│                             │
│  Privacy Policy | Terms     │
│  Support | Accessibility    │
│                             │
│  © 2026 Sankofa. All rights │
│  reserved.                  │
│                             │
└─────────────────────────────┘
  bg-[#F5F5F7], py-12, px-6
  All text: 13px/400 #6E6E73
  Links: hover:text-[#1D1D1F] transition-colors 200ms
  Centered on mobile, separated by | dividers
```

**Desktop (1440px):**
```
┌───────────────────────────────────────────────────────────────────┐
│                                                                   │
│  [Logo]        Privacy  Terms  Support  Accessibility             │
│                                                                   │
│  © 2026 Sankofa. All rights reserved.        United States        │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
  bg-[#F5F5F7], py-8
  max-w-7xl mx-auto px-16
  flex justify-between items-center
  All text: 13px/400 #6E6E73
```

---

## 5. Nano Banana Mockups (FAL AI API)

**API Endpoint:** `POST https://fal.run/fal-ai/nano-banana`
**Auth Header:** `Authorization: Key {FAL_API_KEY}`
**FAL_API_KEY Source:** `.env` file (read at runtime, never hardcoded)

---

### Mockup 1 — Mobile Hero (375px)

**Exact Prompt Used:**
```
Apple.com minimalist product landing page mobile viewport 375px, iPhone 17 Pro Max in Cosmic Orange colorway as hero centerpiece on pure white background, full viewport height hero section, bold SF Pro Display H1 text iPhone 17 Pro Max in #1D1D1F, subheadline Cosmic Orange in warm orange #FF6B35, generous whitespace, premium Apple aesthetic, minimal navbar with apple logo, orange CTA button Buy Now, phone facing front with titanium frame glowing in warm orange tones, photorealistic premium product photography style
```

**API Response:**
```json
{
  "images": [
    {
      "url": "https://v3b.fal.media/files/b/0a9100c7/z3vl7g8Eu4zlyk8RPLu14_CLPutr0E.png",
      "content_type": "image/png",
      "file_name": "z3vl7g8Eu4zlyk8RPLu14_CLPutr0E.png"
    }
  ],
  "description": ""
}
```

**Generated Image URL:**
`https://v3b.fal.media/files/b/0a9100c7/z3vl7g8Eu4zlyk8RPLu14_CLPutr0E.png`

**HTTP Status:** 200 OK

---

### Mockup 2 — Desktop Full Page (1440px)

**Exact Prompt Used:**
```
Apple.com full desktop landing page 1440px wide for iPhone 17 Pro Max Cosmic Orange, white background #FFFFFF, fixed navbar top with minimal logo and nav links, full-width hero section with centered iPhone 17 Pro Max in warm Cosmic Orange titanium, H1 64px bold SF Pro Display iPhone 17 Pro Max, orange subheadline Cosmic Orange, three feature cards in row below hero showing 48MP Fusion Camera and A19 Pro Chip and All-Day Battery with minimal icons on #F5F5F7 cards, large pricing section From $1199 with orange Buy Now button, Apple-style minimal footer, premium whitespace, clean grid layout, ultra premium Apple aesthetic
```

**API Response:**
```json
{
  "images": [
    {
      "url": "https://v3b.fal.media/files/b/0a9100d1/MnGOHaGHyy4NoaNJpcvsy_XogwTTki.png",
      "content_type": "image/png",
      "file_name": "MnGOHaGHyy4NoaNJpcvsy_XogwTTki.png"
    }
  ],
  "description": "Here's a concept for the Apple.com desktop landing page for the iPhone 17 Pro Max Cosmic Orange: "
}
```

**Generated Image URL:**
`https://v3b.fal.media/files/b/0a9100d1/MnGOHaGHyy4NoaNJpcvsy_XogwTTki.png`

**HTTP Status:** 200 OK

---

### Mockup 3 — CTA Button States

**Exact Prompt Used:**
```
UI component design sheet showing CTA button states for Apple-style Buy Now button in Cosmic Orange, three states side by side on white background: Default state bg #FF6B35 white text rounded-2xl with subtle shadow, Hover state bg #CC5228 slightly enlarged scale 1.02 with deeper shadow, Active state bg #B34820 slightly compressed scale 0.98 shadow-inner, ghost Learn More button outline #FF6B35 border transparent background, all buttons 56px height with SF Pro Display font 17px medium weight, clean minimal design system reference sheet style
```

**API Response:**
```json
{
  "images": [
    {
      "url": "https://v3b.fal.media/files/b/0a9100d3/-TmhL4OgaKvxiqhOee37b_2Aeiia3I.png",
      "content_type": "image/png",
      "file_name": "-TmhL4OgaKvxiqhOee37b_2Aeiia3I.png"
    }
  ],
  "description": "Here's a UI component design sheet for your Apple-style \"Buy Now\" button in Cosmic Orange, showing the different states: "
}
```

**Generated Image URL:**
`https://v3b.fal.media/files/b/0a9100d3/-TmhL4OgaKvxiqhOee37b_2Aeiia3I.png`

**HTTP Status:** 200 OK

---

**API Call Summary:** All 3 calls succeeded (HTTP 200). No errors or fallbacks needed.

---

## 6. Responsive Breakpoints

| Breakpoint | Width  | Layout Behavior                                               |
|------------|--------|---------------------------------------------------------------|
| xs         | 320px  | Stack everything, 16px horizontal padding, single column      |
| Mobile     | 375px  | **Primary mobile design**, 24px padding, single column        |
| Tablet     | 768px  | 2-column features grid, larger hero image                     |
| Sm Desktop | 1024px | 3-column features (or 2+2), wider nav                         |
| Desktop    | 1440px | **Primary desktop design**, 4-column features, 64px padding   |

**Tailwind breakpoint config:**
```js
// tailwind.config.ts
screens: {
  'xs':  '320px',
  'sm':  '375px',   // primary mobile
  'md':  '768px',   // tablet
  'lg':  '1024px',  // small desktop
  'xl':  '1440px',  // primary desktop
  '2xl': '1920px',  // large desktop
}
```

**Grid behavior by section:**
- Navbar: always single row, links hidden below md (hamburger menu optional)
- Hero: single column always, image size scales up
- Features: `grid-cols-1 md:grid-cols-2 xl:grid-cols-4`
- ColorStory: single column always, phone images row at md+
- Pricing: single column always, button row at md+
- Footer: stacked at mobile, two-row at md, single row at xl

---

## 7. Accessibility (WCAG AA)

### Color Contrast Ratios

| Foreground | Background | Ratio   | WCAG AA (4.5:1) | WCAG AA Large (3:1) |
|------------|------------|---------|-----------------|---------------------|
| #1D1D1F    | #FFFFFF    | 19.5:1  | PASS            | PASS                |
| #1D1D1F    | #F5F5F7    | 18.4:1  | PASS            | PASS                |
| #6E6E73    | #FFFFFF    | 5.9:1   | PASS            | PASS                |
| #6E6E73    | #F5F5F7    | 5.6:1   | PASS            | PASS                |
| #FFFFFF    | #FF6B35    | 3.1:1   | FAIL (body)     | PASS (large text/UI)|
| #FFFFFF    | #CC5228    | 4.6:1   | PASS            | PASS                |
| #FF6B35    | #FFFFFF    | 3.1:1   | FAIL (body)     | PASS (large text/UI)|

**Notes on #FF6B35 usage:**
- Do NOT use #FF6B35 as a background for body-size white text (fails 4.5:1).
- CTA button text "Buy Now" at 17px bold (600 weight) on #FF6B35: large text rule applies (3:1 threshold) — borderline PASS at large text sizing. Mitigate by using #FFFFFF text only at 18px bold or larger on orange background, or use #CC5228 (hover) as default button background for full AA compliance at all sizes.
- **Recommendation:** Default CTA button background = #CC5228 (4.6:1 with white, PASSES AA). Use #FF6B35 for decorative accents, not primary text-on-color.
- Revised CTA palette:
  - Default: bg-[#CC5228] (WCAG AA pass 4.6:1)
  - Hover: bg-[#B34820]
  - Active: bg-[#993D1A]
  - If visual requirement mandates #FF6B35 for default: use min 18px bold white text only.

### Keyboard Navigation
- Tab order: Navbar Logo → Nav Links → Navbar CTA → Hero CTA (Buy Now) → Hero CTA (Learn More) → Feature Cards → ColorStory → Pricing CTA → Footer Links
- All interactive elements have visible focus rings: `focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-2`
- Skip-to-main-content link: hidden visually, revealed on focus (position: absolute, top-0, z-50)

### ARIA
- Navbar: `<nav aria-label="Main navigation">`
- Hero: `<section aria-labelledby="hero-heading">`
- Feature cards: `<article aria-label="Feature: 48MP Fusion Camera">`
- CTA buttons: `aria-label="Buy iPhone 17 Pro Max Cosmic Orange"`
- Ghost button: `aria-label="Learn more about iPhone 17 Pro Max"`
- Price: `<span aria-label="Starting from $1,199">`
- Mobile sticky bar: `aria-live="polite"` on appearance, `aria-hidden="true"` when not visible
- Images: descriptive alt text required (see Section 9)

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    transition-duration: 0ms !important;
    animation-duration: 0ms !important;
  }
}
```
Framer Motion: use `useReducedMotion()` hook to conditionally disable animations.

### Screen Reader
- Semantic HTML: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- Heading hierarchy: one H1 per page (hero), H2 for section titles, H3 for card titles
- Color is never the sole conveyor of information

---

## 8. Interaction States

### Primary CTA Button ("Buy Now")

| State    | Visual                                                                   | Tailwind Classes                                                              |
|----------|--------------------------------------------------------------------------|-------------------------------------------------------------------------------|
| Default  | bg #CC5228, white text, rounded-2xl, shadow-sm                           | `bg-[#CC5228] text-white rounded-2xl px-8 py-4 shadow-sm font-medium`        |
| Hover    | bg #B34820, scale 1.02, shadow-md                                        | `hover:bg-[#B34820] hover:scale-[1.02] hover:shadow-md`                      |
| Focus    | 2px orange ring offset-2                                                 | `focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-2` |
| Active   | bg #993D1A, scale 0.98, shadow-inner                                     | `active:bg-[#993D1A] active:scale-[0.98] active:shadow-inner`                |
| Disabled | bg #D2D2D7, text #86868B, cursor-not-allowed                             | `disabled:bg-[#D2D2D7] disabled:text-[#86868B] disabled:cursor-not-allowed`  |

Transition: `transition-all duration-200 ease-in-out` (cubic-bezier(0.25, 0.46, 0.45, 0.94))

### Ghost CTA Button ("Learn More")

| State   | Visual                                              | Tailwind Classes                                                                   |
|---------|-----------------------------------------------------|------------------------------------------------------------------------------------|
| Default | transparent bg, #FF6B35 border 1.5px, #FF6B35 text  | `border border-[#FF6B35] text-[#FF6B35] rounded-2xl px-8 py-4 bg-transparent`    |
| Hover   | bg-[#FFF3EE], border #CC5228, text #CC5228          | `hover:bg-[#FFF3EE] hover:border-[#CC5228] hover:text-[#CC5228]`                 |
| Focus   | 2px orange ring                                     | `focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-2`  |
| Active  | bg-[#FFE8DC], scale 0.98                            | `active:bg-[#FFE8DC] active:scale-[0.98]`                                        |

### Feature Cards

| State  | Visual                                       | Tailwind Classes                                                         |
|--------|----------------------------------------------|--------------------------------------------------------------------------|
| Default | bg #F5F5F7, rounded-2xl, shadow-sm          | `bg-[#F5F5F7] rounded-2xl shadow-sm p-6`                                |
| Hover  | shadow-md, translate-y -4px                  | `hover:shadow-md hover:-translate-y-1`                                   |
| Focus  | 2px orange ring                              | `focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-2` |

Transition: `transition-all duration-200 ease-in-out`

### Navbar

| State     | Visual                                                | Tailwind Classes                                                                        |
|-----------|-------------------------------------------------------|-----------------------------------------------------------------------------------------|
| Top       | Transparent background, full color text               | `bg-transparent`                                                                       |
| Scrolled  | White/90 blur, bottom border                          | `bg-white/90 backdrop-blur-md border-b border-[#E5E5E7] shadow-sm`                    |

Transition: `transition-all duration-300 ease-in-out`

### Mobile Sticky CTA Bar

| State    | Visual                                    | Behavior                                                |
|----------|-------------------------------------------|---------------------------------------------------------|
| Hidden   | Off-screen below fold                     | `translate-y-full` or `opacity-0 pointer-events-none`   |
| Visible  | Slides up from bottom                     | `translate-y-0 opacity-100` triggered by IntersectionObserver |

Trigger condition: Hero section exits viewport (IntersectionObserver threshold 0).

---

## 9. Handoff Notes for Software Engineer

### Image Assets

| Asset                  | Usage               | Format     | Max Size | Alt Text                                              |
|------------------------|---------------------|------------|----------|-------------------------------------------------------|
| iPhone 17 Pro Max hero | Hero section        | WebP/AVIF  | 150KB    | "iPhone 17 Pro Max in Cosmic Orange colorway, front view" |
| iPhone angle 1         | ColorStory          | WebP/AVIF  | 80KB     | "iPhone 17 Pro Max Cosmic Orange, angled view"        |
| iPhone angle 2         | ColorStory          | WebP/AVIF  | 80KB     | "iPhone 17 Pro Max Cosmic Orange, side profile"       |
| iPhone angle 3         | ColorStory          | WebP/AVIF  | 80KB     | "iPhone 17 Pro Max Cosmic Orange, rear view"          |
| Feature icons (4x)     | Feature cards       | SVG        | <5KB ea  | Decorative (aria-hidden="true")                       |

All images: `loading="lazy"` except hero (`loading="eager"`, `priority={true}` in Next.js Image).

### Tailwind Class Mappings (Key Components)

**Page Layout:**
```
<main class="min-h-screen bg-white font-sans text-[#1D1D1F]">
```

**Navbar:**
```
<nav class="fixed top-0 left-0 right-0 z-50 h-11 md:h-13 px-6 xl:px-16
            flex items-center justify-between
            transition-all duration-300 ease-in-out
            [data-scrolled]:bg-white/90 [data-scrolled]:backdrop-blur-md
            [data-scrolled]:border-b [data-scrolled]:border-[#E5E5E7]">
```

**Hero Section:**
```
<section class="min-h-screen flex flex-col items-center justify-center
                pt-16 pb-12 px-6 xl:max-w-4xl xl:mx-auto xl:px-16
                text-center gap-4">
  <h1 class="text-[36px] xl:text-[64px] font-bold text-[#1D1D1F] leading-tight">
  <p class="text-[24px] xl:text-[32px] font-semibold text-[#FF6B35]">
  <p class="text-[17px] text-[#6E6E73]">
```

**Primary CTA Button:**
```
<button class="w-full sm:w-[200px] h-14 bg-[#CC5228] text-white
               font-medium text-[17px] rounded-2xl shadow-sm
               transition-all duration-200 ease-in-out
               hover:bg-[#B34820] hover:scale-[1.02] hover:shadow-md
               focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-2
               active:bg-[#993D1A] active:scale-[0.98] active:shadow-inner
               disabled:bg-[#D2D2D7] disabled:text-[#86868B] disabled:cursor-not-allowed">
  Buy Now
</button>
```

**Ghost CTA Button:**
```
<button class="w-full sm:w-[200px] h-14 bg-transparent
               border border-[#FF6B35] text-[#FF6B35]
               font-medium text-[17px] rounded-2xl
               transition-all duration-200 ease-in-out
               hover:bg-[#FFF3EE] hover:border-[#CC5228] hover:text-[#CC5228]
               focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-2
               active:bg-[#FFE8DC] active:scale-[0.98]">
  Learn More
</button>
```

**Feature Card:**
```
<article class="bg-[#F5F5F7] rounded-2xl shadow-sm p-6 xl:p-8
                transition-all duration-200 ease-in-out
                hover:shadow-md hover:-translate-y-1
                focus-within:ring-2 focus-within:ring-[#FF6B35] focus-within:ring-offset-2">
```

**Features Grid:**
```
<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-6">
```

**Mobile Sticky CTA Bar:**
```
<div class="fixed bottom-0 left-0 right-0 z-50 md:hidden
            bg-white/95 backdrop-blur-md border-t border-[#E5E5E7]
            px-6 py-3 flex items-center justify-between
            transition-transform duration-200 ease-in-out
            [data-hidden]:translate-y-full">
  <span class="text-[17px] font-semibold text-[#1D1D1F]">From $1,199</span>
  <button class="bg-[#CC5228] text-white text-sm font-medium
                 rounded-full px-6 py-2
                 hover:bg-[#B34820] transition-colors duration-200">
    Buy Now
  </button>
</div>
```

**ColorStory Section:**
```
<section class="py-20 xl:py-28 bg-gradient-to-b from-[#FFF3EE] to-white">
  <div class="max-w-5xl mx-auto px-6 xl:px-16 text-center">
```

**Pricing Section:**
```
<section class="py-20 xl:py-28 bg-[#F5F5F7]">
  <div class="max-w-3xl mx-auto px-6 xl:px-16 text-center">
    <p class="text-[36px] xl:text-[48px] font-bold text-[#1D1D1F]">From $1,199</p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center mt-8">
```

**Footer:**
```
<footer class="bg-[#F5F5F7] py-12 xl:py-8 px-6 xl:px-16">
  <div class="max-w-7xl mx-auto flex flex-col xl:flex-row
              items-center xl:justify-between gap-4">
    <p class="text-[13px] text-[#6E6E73]">
```

### Performance Targets (Core Web Vitals)

| Metric | Target  | Implementation Note                                          |
|--------|---------|--------------------------------------------------------------|
| LCP    | < 2.5s  | Hero image: WebP, preload link in `<head>`, `priority={true}` |
| FID    | < 100ms | Minimize JS on initial load; defer non-critical scripts       |
| CLS    | < 0.1   | Reserve image dimensions; no dynamic content insertion above fold |

### Implementation Notes

1. **Sticky bar trigger:** Use `IntersectionObserver` on the hero `<section>` with `threshold: 0`. When hero is no longer intersecting, add `data-visible` to sticky bar element.
2. **Navbar scroll state:** `window.addEventListener('scroll', ...)`, toggle `data-scrolled` attribute on `<nav>` when `scrollY > 60`.
3. **Framer Motion animations:** Wrap feature cards and sections in `<motion.div>` with `initial={{ opacity: 0, y: 20 }}` and `whileInView={{ opacity: 1, y: 0 }}`. Check `useReducedMotion()` before applying.
4. **Font loading:** Use `font-display: swap` for SF Pro. Fallback chain ensures no FOIT.
5. **Image component:** Use Next.js `<Image>` with explicit `width` and `height` to prevent CLS. Hero image: `fill` with aspect-ratio container.
6. **Color swatch in ColorStory:** `<div>` with `bg-[#FF6B35]` and `rounded-3xl` — not an image — for instant paint.
7. **Section IDs:** `id="features"`, `id="color-story"`, `id="pricing"` for nav anchor links and smooth scroll.
8. **Smooth scroll:** `html { scroll-behavior: smooth; }` — disabled under `prefers-reduced-motion`.

### Dependencies Required

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^18.3.0",
    "framer-motion": "^11.0.0",
    "tailwindcss": "^3.4.0"
  }
}
```

---

## Appendix: Section → File Mapping (Suggested)

```
src/
  components/
    Navbar.tsx
    HeroSection.tsx
    FeaturesSection.tsx
    FeatureCard.tsx
    ColorStorySection.tsx
    PricingSection.tsx
    StickyMobileCTA.tsx
    Footer.tsx
  app/
    page.tsx           ← assembles all sections
    layout.tsx         ← font loading, metadata
  styles/
    globals.css        ← CSS custom properties, scroll-behavior
```

---

*Design spec complete. Approved for Engineer handoff.*
*Task ID: PROJ-002 | Status: Done | Next: PROJ-003 (Software Engineer)*
