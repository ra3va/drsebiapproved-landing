# Black Friday Revert Plan

## When to Revert: November 30, 2025 (after 12:00 AM PST)

### Files to Change Back:

#### 1. **src/app/page.tsx** - Hero Section
**Change FROM:**
```tsx
import BlackFridayHero from "@/components/BlackFridayHero";
// ...
<BlackFridayHero />
```

**Change TO:**
```tsx
import OriginalHero from "@/components/OriginalHero";
// ...
<OriginalHero />
```

#### 2. **src/app/page.tsx** - Product Cards
Remove all Black Friday badges and restore original pricing:

**ParaCleanse Elite:**
- Remove: Black Friday badge div
- Price: $41.99 → **$59.99**
- Remove: Yellow savings badge and "Use code" text

**Maya Formula:**
- Remove: Black Friday badge div
- Price: $31.49 → **$44.99**
- Original text: "Save 25% | Was $59.99"

**Sea Moss:**
- Remove: Black Friday badge div
- Price: $22.39 → **$31.99**
- Original text: "Save 36% | Was $49.99"

**Mucus Cleanser:**
- Remove: Black Friday badge div
- Price: $27.99 → **$39.99**
- Original text: "Respiratory & Cellular Support"

#### 3. **src/app/layout.tsx** - Remove Banner
**Remove:**
```tsx
import BlackFridayBanner from '@/components/BlackFridayBanner'
// and
<BlackFridayBanner />
```

#### 4. **src/components/Header.tsx** - Revert Header Theme
Change header back from black to original blue/teal theme.

---

## Quick Revert Commands

```bash
# 1. Switch hero back to original
# In src/app/page.tsx, change import and component

# 2. Remove Black Friday banner from layout
# In src/app/layout.tsx, remove import and component

# 3. Restore original product pricing
# Remove Black Friday badges and update prices in src/app/page.tsx

# 4. Revert header theme
# Update Header.tsx to original colors
```

---

## Original Pricing Reference

| Product | Original Price | Black Friday Price |
|---------|---------------|-------------------|
| ParaCleanse Elite | $59.99 | $41.99 |
| Maya Formula | $44.99 | $31.49 |
| Sea Moss | $31.99 | $22.39 |
| Mucus Cleanser | $39.99 | $27.99 |

---

## Files Backed Up

- `src/components/OriginalHero.tsx` - Original hero section (preserved)
- This document - Revert instructions

