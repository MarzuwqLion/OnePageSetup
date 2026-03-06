# PROJ-012 Engineer Output

**Task ID:** PROJ-012
**Status:** Done
**File Modified:** `app/page.tsx`

Removed `bg-white` from the `<main>` element's className on line 13 of `app/page.tsx`. The class was a blanket white background applied to the entire page wrapper, which overrode section-level background colors — specifically `bg-black` on the HeroSection and `bg-[#1D1D1F]` on ColorStorySection — causing those dark sections to render as white. The remaining classes (`min-h-screen`, `font-sans`, `text-[#1D1D1F]`) are preserved exactly as-is. No other files were modified. Each section now controls its own background: Hero (`bg-black`), Features (default/white), ColorStory (`bg-[#1D1D1F]`), PricingCTA (`bg-[#F5F5F7]`), and Footer (`bg-[#F5F5F7]`).
