# Checkout Fixes & Receipt Email Session
**Date**: Mon Nov 24 21:41:41 CST 2025
**Duration**: ~30 minutes
**Focus**: Fix checkout discount issue, add transactional receipt emails
**Logged by**: Claude

## Session Summary

### Primary Objectives Completed ✅
1. Fixed Square checkout failing with coupon codes (400 Bad Request)
2. Added transactional receipt email via Brevo after purchase

## Key Issues Resolved

### 1. "Payment total does not match order total" Error
**Problem**: TEST99 coupon applied 99% discount on frontend ($1.00 total), but Square order was created at full price ($99.98). Square validates payment amount must match order total.

**Solution**: Added discount calculation to `/api/square/process-payment/route.ts` - now applies a `FIXED_AMOUNT` discount to the Square order to match the payment amount.

## Files Modified/Created

### Committed to Production
- `src/app/api/square/process-payment/route.ts` - Added discount application to Square order
- `src/app/api/brevo/send-receipt/route.ts` - NEW: Transactional receipt email endpoint
- `src/app/checkout/success/page.tsx` - Added receipt email trigger after purchase

### Receipt Email Features
- Branded HTML email with green header
- Order summary with line items
- Shows subtotal, shipping (FREE badge), discount with coupon code, total
- Shipping address display
- Bundle purchase callout if multiple items
- "What's Next" section about shipping timeline
- Sent via Brevo transactional API

## Testing Results
- TEST99 coupon now works correctly
- Test receipt email sent to kingthriva@gmail.com successfully
- Apple Pay prepaid card declined (Square fraud protection - not code issue)

## Git Commits
- `54d2c15` - fix: apply discount to Square order to match payment amount
- `078977e` - feat: add transactional receipt email via Brevo after purchase

## Next Session Plan

### Priority: Black Friday Email Campaign
1. Set up Zoho email campaign to customer list
2. Announce Black Friday sale (not win-back approach)
3. Implement GA4 tracking for Zoho campaign clicks
4. Time-sensitive: Black Friday approaching fast

### GA4 Tracking for Zoho
- Add UTM parameters to campaign links
- Verify click tracking is working
- Set up conversion tracking in GA4

---
*End of Session: Mon Nov 24 21:41:41 CST 2025*

