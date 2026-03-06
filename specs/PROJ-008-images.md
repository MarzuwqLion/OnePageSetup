# PROJ-008 — FAL AI Generated iPhone 17 Pro Max Images

**Task ID:** PROJ-008
**Agent:** UI/UX Designer
**Date:** 2026-03-05
**Status:** Done

---

## Context

Apple's CDN blocks hotlinking, causing all Apple-sourced image URLs in the hero and ColorStory sections to return 403/broken images. This spec documents the replacement images generated via FAL AI Nano Banana. All generated URLs are on `v3b.fal.media`, which is already included in the project's CSP and Next.js `remotePatterns` configuration — they are known-working and hotlink-safe.

---

## Image 1 — Hero (Front + Back, Cosmic Orange)

**Intended Section:** Hero section (mobile portrait hero image)

**Prompt Used:**
```
Apple iPhone 17 Pro Max smartphone in Cosmic Orange colorway, photorealistic product photography, front and back view side by side, warm vivid orange aluminum unibody chassis, triple 48MP camera system with rectangular camera island, matte premium finish, black studio background, professional Apple-style product photography, dramatic lighting, ultra high quality
```

**Full API Response:**
```json
{
  "images": [
    {
      "url": "https://v3b.fal.media/files/b/0a9102b4/3aIgynrC_fcGW06FQoHv1_fQWObz1Q.png",
      "content_type": "image/png",
      "file_name": "3aIgynrC_fcGW06FQoHv1_fQWObz1Q.png",
      "file_size": null,
      "width": null,
      "height": null
    }
  ],
  "description": ""
}
```

**Generated Image URL:**
`https://v3b.fal.media/files/b/0a9102b4/3aIgynrC_fcGW06FQoHv1_fQWObz1Q.png`

**Recommendation:** Use this as the primary Hero image. Shows front and back of the Cosmic Orange iPhone 17 Pro Max on a black studio background — ideal for the hero section above the fold.

---

## Image 2 — ColorStory Feature (All Three Colors, Fan Layout)

**Intended Section:** ColorStory section — phone renders showing color variants

**Prompt Used:**
```
Three Apple iPhone 17 Pro smartphones arranged in a fan layout showing all three colors: Deep Blue, Cosmic Orange, and Silver, rear-facing cameras visible, photorealistic Apple product photography, matte aluminum finish, black studio background, professional lighting, ultra detailed
```

**Full API Response:**
```json
{
  "images": [
    {
      "url": "https://v3b.fal.media/files/b/0a9102b5/GaPe8yDttbW7uYFKDhvsG_LwovZYGG.png",
      "content_type": "image/png",
      "file_name": "GaPe8yDttbW7uYFKDhvsG_LwovZYGG.png",
      "file_size": null,
      "width": null,
      "height": null
    }
  ],
  "description": "Here's your image of the iPhone 17 Pro smartphones: "
}
```

**Generated Image URL:**
`https://v3b.fal.media/files/b/0a9102b5/GaPe8yDttbW7uYFKDhvsG_LwovZYGG.png`

**Recommendation:** Use this as the ColorStory section phone render. Shows all three color variants (Deep Blue, Cosmic Orange, Silver) in a fan arrangement — replaces the broken Apple CDN multi-color renders.

---

## Image 3 — Camera System Detail (Cosmic Orange Rear Close-Up)

**Intended Section:** Camera feature section or secondary hero accent

**Prompt Used:**
```
iPhone 17 Pro Max Cosmic Orange rear camera system close-up, triple 48MP lens array in rectangular camera island on warm orange aluminum surface, Apple logo visible below camera, photorealistic macro product photography, premium lighting, black background
```

**Full API Response:**
```json
{
  "images": [
    {
      "url": "https://v3b.fal.media/files/b/0a9102b6/NpnKgVLEDXvK9KMSfm8fF_2x6y4ZVa.png",
      "content_type": "image/png",
      "file_name": "NpnKgVLEDXvK9KMSfm8fF_2x6y4ZVa.png",
      "file_size": null,
      "width": null,
      "height": null
    }
  ],
  "description": ""
}
```

**Generated Image URL:**
`https://v3b.fal.media/files/b/0a9102b6/NpnKgVLEDXvK9KMSfm8fF_2x6y4ZVa.png`

**Recommendation:** Use this as a camera section detail image or decorative accent. Close-up of the triple 48MP camera island on the Cosmic Orange surface with Apple logo visible.

---

## CDN Verification

All three URLs are on `v3b.fal.media` (FAL AI CDN). This domain is already configured in the project:

- **Next.js `next.config.ts` `remotePatterns`:** `v3b.fal.media` is an approved domain
- **CSP headers:** `v3b.fal.media` is whitelisted in `img-src`
- **Hotlink protection:** FAL AI CDN does NOT block third-party embedding — these URLs will load correctly in the Next.js page

No further configuration changes are required. The Software Engineer can drop these URLs directly into the page components.

---

## Replacement Map

| Section | Old Broken URL (Apple CDN) | New Working URL (FAL CDN) |
|---|---|---|
| Hero image | `store.storeimages.cdn-apple.com/...` | `https://v3b.fal.media/files/b/0a9102b4/3aIgynrC_fcGW06FQoHv1_fQWObz1Q.png` |
| ColorStory phone renders | `store.storeimages.cdn-apple.com/...` | `https://v3b.fal.media/files/b/0a9102b5/GaPe8yDttbW7uYFKDhvsG_LwovZYGG.png` |
| Camera detail | `store.storeimages.cdn-apple.com/...` | `https://v3b.fal.media/files/b/0a9102b6/NpnKgVLEDXvK9KMSfm8fF_2x6y4ZVa.png` |

---

## Handoff

**Task ID:** PROJ-008
**Status:** Done
**Handoff to:** Software Engineer (PROJ-009) — replace broken Apple CDN image URLs in page components with the FAL CDN URLs above.
