# PROJ-009 Engineer Output

**Task ID:** PROJ-009
**Status:** Done
**Date:** 2026-03-05
**Assigned To:** Software Engineer

## Summary

Replaced all Apple CDN image URLs with verified FAL AI CDN URLs. Removed Apple CDN entries from Next.js image proxy config and CSP headers in both `next.config.ts` and `vercel.json`.

## Changes Made

### 1. `lib/content.ts`
- Hero image (`heroContent.image.src`): replaced Apple newsroom URL with `https://v3b.fal.media/files/b/0a9102b4/3aIgynrC_fcGW06FQoHv1_fQWObz1Q.png` (800x800)
- ColorStory image 1 (`colorStoryContent.images[0].src`): same FAL URL as hero (800x800)
- ColorStory image 2 (`colorStoryContent.images[1].src`): replaced Apple lineup URL with `https://v3b.fal.media/files/b/0a9102b5/GaPe8yDttbW7uYFKDhvsG_LwovZYGG.png` (800x800)
- ColorStory image 3 (`colorStoryContent.images[2].src`): replaced Apple hero URL with `https://v3b.fal.media/files/b/0a9102b6/NpnKgVLEDXvK9KMSfm8fF_2x6y4ZVa.png` (800x800, corrected from 1400x788)
- Zero Apple CDN URLs remain in this file.

### 2. `next.config.ts`
- Removed `{ protocol: 'https', hostname: 'www.apple.com' }` from `remotePatterns`
- Removed `https://www.apple.com` from CSP `img-src` directive

### 3. `vercel.json`
- Removed `https://www.apple.com` from CSP `img-src` directive

## Acceptance Criteria Verification

| Criterion | Result |
|---|---|
| `lib/content.ts` — zero Apple CDN URLs, all 4 image slots use `v3b.fal.media` | PASS |
| `next.config.ts` — `www.apple.com` removed from remotePatterns | PASS |
| `next.config.ts` — `www.apple.com` removed from CSP img-src | PASS |
| `vercel.json` — `https://www.apple.com` removed from CSP img-src | PASS |
| No other files modified | PASS |

## Files Modified
- `C:/Paradise/Sankofa/OnePageSite/lib/content.ts`
- `C:/Paradise/Sankofa/OnePageSite/next.config.ts`
- `C:/Paradise/Sankofa/OnePageSite/vercel.json`
