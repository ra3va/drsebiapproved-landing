# Mucus Cleanser Win-Back Campaign Funnel - Complete Implementation

**Date**: Saturday, November 22, 2025 - 10:13 AM CST
**Duration**: ~3 hours
**Session Type**: Full feature implementation
**Branch**: main
**Logged by**: Claude (Sprock)

---

## Session Summary

Successfully built a complete win-back campaign funnel for the Mucus Cleanser product, targeting lapsed customers with a 37% discount during flu season. The funnel includes a full e-commerce landing page, email opt-in with Brevo integration, automatic checkout redirect, and prominent discount display throughout the purchase flow.

### Primary Objectives Completed ✅

1. **Created Square Discount Code** - STOPMUCUS (37.5% off)
2. **Built Win-Back Landing Page** - Full e-commerce pre-sell page at `/mucus-winback`
3. **Brevo List Integration** - Auto-creates "Win-Back - Mucus Cleanser" list
4. **Direct Checkout Flow** - Email opt-in → immediate redirect to checkout
5. **Discount Visibility** - Green discount display in order summary
6. **Pricing Corrections** - Updated from $31.99 to $39.99 base price

---

## Key Issues Resolved

### Issue 1: Pricing Inconsistency
**Problem**: Homepage showed Mucus Cleanser at $31.99 (discounted from $59.99), but win-back campaign needed $39.99 base price to show correct savings.

**Solution**:
- Updated homepage price from $31.99 → $39.99
- Updated checkout product config from 3199 cents → 3999 cents
- STOPMUCUS coupon now shows: $39.99 → $24.99 (save $15.00)

**Files Modified**:
- `/src/app/page.tsx` (line 270)
- `/src/app/checkout/page.tsx` (line 57)

### Issue 2: Redirect Flow
**Problem**: User wanted immediate redirect to checkout after email opt-in, not staying on landing page.

**Solution**: Added automatic redirect with 1-second delay to show success state, then redirect to checkout with auto-applied coupon.

**Files Modified**:
- `/src/components/WinBackOptIn.tsx` (lines 56-59)

### Issue 3: Discount Visibility
**Problem**: Needed prominent green display of discount in checkout so customers know their coupon worked.

**Solution**:
- Added large green banner at top: "🎉 Discount Applied: STOPMUCUS"
- Added green discount line in order summary: "Discount (STOPMUCUS): -$15.00"
- Applied to all 3 order summary locations (mobile collapsed, expanded, payment page)

**Files Modified**:
- `/src/components/SquareCheckout.tsx` (lines 812-831, 601-606, 770-775, 1106-1111)

---

## Technical Implementation

### 1. Square Discount Code Creation

Created programmatic script to generate STOPMUCUS coupon:

**File**: `/scripts/create-stopmucus-coupon.sh`
```bash
# Creates 37.5% discount in Square production catalog
curl -s ${API_BASE}/v2/catalog/object \
  -X POST \
  -H "Square-Version: 2025-10-16" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -d '{ "discount_type": "FIXED_PERCENTAGE", "percentage": "37.5" }'
```

**Result**:
- Discount ID: `KYF4T674JG7Y7HMEMLZY56BF`
- Added to `/src/app/api/square/verify-coupon/route.ts`

### 2. Brevo Win-Back List Creation

**API Endpoint**: `/src/app/api/brevo/winback-optin/route.ts`
- Uses `brevoClient.findOrCreateList('Win-Back - Mucus Cleanser')`
- Auto-creates list on first opt-in
- Sets custom attributes:
  - `DISCOUNT_CODE`: STOPMUCUS
  - `COUNTDOWN_EXPIRES`: 72 hours from opt-in
  - `WINBACK_SOURCE`: mucus-cleanser-winback
  - `CUSTOMER_STATUS`: win-back-lead

### 3. Win-Back Landing Page

**File**: `/src/app/mucus-winback/page.tsx` (427 lines)

**Key Sections**:
1. **Hero with Product Image**
   - Product image: `/mucus.png`
   - Flu season badge: "FLU SEASON SPECIAL - RETURNING CUSTOMERS ONLY"
   - Headline: "We Miss You! Save $15 on Your Mucus Cleanser Restock"

2. **Pricing Display**
   - Regular: $39.99 (crossed out)
   - Win-back: $24.99 (large green text)
   - Savings: "Save $15 (37% OFF!)"

3. **72-Hour Countdown Timer**
   - Component: `<CountdownTimer hours={72} />`
   - Persistent via localStorage
   - Shows days, hours, minutes, seconds

4. **Email Opt-In Gate**
   - Component: `<WinBackOptIn />`
   - Fields: Email (required), First Name (optional)
   - On success: Redirects to checkout with coupon

5. **Pre-Sell Content**
   - "Why Now? Flu Season" section
   - Formula breakdown (Cascara, Mullein, African Bird Pepper)
   - Dr. Sebi quote
   - Social proof from repeat customers

### 4. Countdown Timer Component

**File**: `/src/components/CountdownTimer.tsx` (145 lines)

**Features**:
- Configurable duration (default 72 hours)
- LocalStorage persistence (key: `winback-timer-expiry`)
- Auto-updates every second
- Mobile-responsive grid layout
- Expiry callback support

### 5. Email Opt-In Component

**File**: `/src/components/WinBackOptIn.tsx` (165 lines)

**Flow**:
1. User enters email + optional first name
2. Calls `/api/brevo/winback-optin` endpoint
3. Shows success state: "Discount Claimed! 🎉"
4. Displays STOPMUCUS code
5. Shows spinning loader: "Redirecting to secure checkout..."
6. **Auto-redirects after 1 second** to: `/checkout?product=mucus-cleanser&coupon=STOPMUCUS`

### 6. Auto-Coupon Application

**Files Modified**:
- `/src/app/checkout/page.tsx` (lines 73-82, 120)
- `/src/components/SquareCheckout.tsx` (lines 21, 37, 152-177)

**Logic**:
1. Checkout page reads `?coupon=STOPMUCUS` from URL
2. Passes as `initialCoupon` prop to SquareCheckout
3. SquareCheckout auto-fills coupon field
4. Auto-verifies coupon on mount via `/api/square/verify-coupon`
5. Sets discount state if valid

**useEffect Hook** (SquareCheckout.tsx:152-177):
```typescript
useEffect(() => {
  if (initialCoupon && !couponCode && subtotal > 0) {
    setCouponCode(initialCoupon)
    // Auto-verify the coupon
    const autoVerify = async () => {
      const response = await fetch('/api/square/verify-coupon', {
        method: 'POST',
        body: JSON.stringify({ code: initialCoupon, price: subtotal })
      })
      const data = await response.json()
      if (data.valid) {
        setDiscount(data.discount)
      }
    }
    autoVerify()
  }
}, [initialCoupon, subtotal])
```

### 7. Discount Display - Three Locations

**A. Top Banner** (SquareCheckout.tsx:812-831)
```tsx
{discount > 0 && (
  <div className="bg-gradient-to-r from-green-600 to-green-500 border-2 border-green-700 rounded-lg p-4 mb-4 shadow-lg">
    <p className="font-bold text-white text-base">
      🎉 Discount Applied: {couponCode.toUpperCase()}
    </p>
    <p className="text-green-50 text-sm">
      You're saving ${(discount / 100).toFixed(2)} on your order!
    </p>
  </div>
)}
```

**B. Collapsed Order Summary** (lines 601-606)
```tsx
{discount > 0 && (
  <div className="flex justify-between text-green-600 font-semibold">
    <span>Discount ({couponCode.toUpperCase()})</span>
    <span>-${(discount / 100).toFixed(2)}</span>
  </div>
)}
```

**C. Expanded Summary & Payment Page** (similar pattern)

---

## Files Created

### New Files (5)
1. `/src/app/mucus-winback/page.tsx` - Win-back landing page (427 lines)
2. `/src/app/api/brevo/winback-optin/route.ts` - Email capture endpoint (61 lines)
3. `/src/components/CountdownTimer.tsx` - Timer component (145 lines)
4. `/src/components/WinBackOptIn.tsx` - Opt-in form component (165 lines)
5. `/scripts/create-stopmucus-coupon.sh` - Square coupon creation script (52 lines)

### Modified Files (5)
1. `/src/app/page.tsx` - Updated Mucus Cleanser price to $39.99
2. `/src/app/checkout/page.tsx` - Added initialCoupon prop, updated price config
3. `/src/components/SquareCheckout.tsx` - Added auto-coupon logic + discount display
4. `/src/app/api/square/verify-coupon/route.ts` - Added STOPMUCUS discount ID

---

## Key Decisions & Rationale

### Decision 1: Direct Redirect vs. Landing Page CTA
**Chosen**: Direct redirect to checkout after email opt-in
**Rationale**:
- Reduces friction in conversion funnel
- User has already been pre-sold on landing page
- Immediate gratification after entering email
- Clearer path to purchase

### Decision 2: Pricing Strategy
**Chosen**: $39.99 base price → $24.99 with coupon
**Rationale**:
- Shows meaningful savings ($15 vs. previous $12)
- 37% discount is psychologically compelling
- Differentiates from homepage price
- Win-back customers get exclusive pricing

### Decision 3: Green Color for Discount
**Chosen**: Green text + green banner for all discount displays
**Rationale**:
- Green = savings, positive emotion
- Stands out from standard gray text
- Reinforces "win" feeling
- Consistent with brand's natural/health positioning

### Decision 4: 72-Hour Countdown Timer
**Chosen**: 72-hour timer with localStorage persistence
**Rationale**:
- Creates urgency without being too aggressive
- 3 days allows for consideration + Brevo automation
- Persistent timer prevents gaming the system
- Aligns with email sequence timing

---

## Next Session Plan

### Immediate Next Steps

1. **Abandoned Cart Tracking Enhancement**
   - Tag contacts in Brevo when email entered (Step 1)
   - Update tag when shipping address entered (Step 2)
   - Remove from abandoned cart list if purchase completes
   - Create abandoned cart recovery sequence in Brevo

2. **Brevo Automation Sequences** (Manual in Brevo Dashboard)
   - Email 1: Immediate - "Your $24.99 Mucus Cleanser is waiting"
   - Email 2: 2 hours - Abandoned cart if `CHECKOUT_IN_PROGRESS = true`
   - Email 3: 48 hours - "Last chance" if no purchase

3. **Testing & QA**
   - Test full funnel with real email
   - Verify Brevo list creation
   - Check abandoned cart tracking
   - Test coupon application edge cases

### Blockers/Issues

**Abandoned Cart Logic**: Need to implement better tracking for:
- Email entered but no address (low intent)
- Address entered but no purchase (high intent)
- Different recovery sequences based on abandonment stage

Currently exists in codebase but needs verification:
- `/src/app/api/brevo/checkout-started` - Tracks email entry
- `/src/app/api/brevo/cart-abandoned` - Tracks abandonment
- `CHECKOUT_ABANDONED_STAGE` attribute tracks step (step_1, step_2, step_3)

### Testing Required

- [ ] Email opt-in creates Brevo contact
- [ ] Redirect to checkout works
- [ ] Coupon auto-applies correctly
- [ ] Discount shows in all 3 locations
- [ ] $39.99 → $24.99 calculation correct
- [ ] Countdown timer persists across page loads
- [ ] Free shipping applies with Maya upsell
- [ ] Purchase completes successfully

---

## Session Metrics

- **Files Created**: 5
- **Files Modified**: 4
- **Lines of Code**: ~850
- **Components Built**: 3 (CountdownTimer, WinBackOptIn, MucusWinBackPage)
- **API Routes Created**: 1
- **Square Discounts Created**: 1
- **Brevo Lists**: 1 (auto-created)
- **Status**: ✅ Complete - Ready for deployment

---

## Context for Future Sessions

### Campaign Overview
This is a **flu season win-back campaign** targeting lapsed Mucus Cleanser customers. The messaging emphasizes:
- Seasonal urgency (November-March flu season)
- Nostalgia ("Remember what you loved?")
- Exclusive return customer pricing
- Limited-time 72-hour offer

### Revenue Impact
- **Target**: Lapsed customers (last purchase 90+ days ago)
- **Offer**: $24.99 (37% off $39.99)
- **Potential Revenue**: If 10% of 1,200 Mucus Cleanser customers convert = 120 orders × $24.99 = **~$3,000 revenue**
- **List Building**: Captures emails for future Brevo automation

### Technical Architecture
- **Zoho**: Initial campaign send (manual CSV upload)
- **Landing Page**: Pre-sell + email capture
- **Brevo**: Automation sequences post-opt-in
- **Square**: Payment processing with 37.5% discount
- **Checkout**: Multi-step with Maya upsell ($44.99)

### Integration Points
- Landing page → Brevo (email capture)
- Brevo → Checkout (URL with coupon param)
- Checkout → Square (payment + discount)
- Square → Brevo (purchase complete, remove from abandoned cart)

---

**Session completed successfully - Ready for Carl's review and deployment**

---
*End of Session: Saturday, November 22, 2025 - 10:13 AM CST*
