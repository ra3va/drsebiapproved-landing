# Shippo Automated Shipping - Implementation Guide

**Goal:** Fully automated label creation when Square orders are created. Zero manual work.

**Time Estimate:** 1-2 hours implementation + 15 min testing

---

## Prerequisites (Gather Before Next Session)

### 1. Shippo Account Details
- [ ] Shippo API Token (Live)
- [ ] Shippo Test API Token (for testing)
- Location: Shippo Dashboard → Settings → API

### 2. Square Webhook Setup
- [ ] Square webhook signing key
- Location: Square Dashboard → Webhooks → Signing Key

### 3. Email for Label Notifications
- [ ] Your email for label PDFs (kingthriva@gmail.com or other)

---

## Architecture Overview

```
Customer Orders → Square Order Created
    ↓
Square Webhook → /api/shippo/create-label (NEW)
    ↓
Shippo API → Creates Label + Returns PDF
    ↓
Square API → Updates Order with Tracking
    ↓
Email → Label PDF sent to you
    ↓
Customer → Gets tracking notification (Shippo auto-sends)
```

---

## Files to Create

### 1. `/src/app/api/shippo/create-label/route.ts` (NEW)
**Purpose:** Receives Square webhooks, creates Shippo labels, updates Square with tracking

**What it does:**
- Listens for `order.created` webhook from Square
- Validates webhook signature
- Extracts shipping address from Square order
- Calls Shippo API to create label
- Updates Square order with tracking number
- Emails label PDF

**Key logic:**
```typescript
// 1. Validate Square webhook signature
// 2. Check if order has SHIPMENT fulfillment
// 3. Create Shippo shipment + transaction
// 4. Get label PDF URL and tracking number
// 5. Update Square order with tracking
// 6. Send email with label PDF link
```

---

### 2. `/src/app/api/shippo/webhook/route.ts` (NEW)
**Purpose:** Receives Shippo tracking updates (optional, for future real-time tracking page)

**What it does:**
- Listens for tracking updates from Shippo
- Updates database or sends customer notifications
- Not critical for Phase 1 - can skip initially

**Status:** Optional for now

---

### 3. `/src/app/track-order/page.tsx` (NEW - Customer Tracking Page)
**Purpose:** Customer-facing page to look up order tracking

**What it does:**
- Customer enters order number or email
- Looks up order in Square
- Fetches tracking from Shippo
- Shows live tracking status + map

**Time:** 30-45 minutes
**Priority:** Phase 2 (after shipping works)

---

### 4. `/src/app/api/track-order/route.ts` (NEW - Tracking API)
**Purpose:** Backend API for customer tracking lookup

**What it does:**
- Accepts order ID or email
- Queries Square for order
- Gets tracking number from order
- Calls Shippo tracking API
- Returns tracking data

**Priority:** Phase 2

---

## Files to Modify

### 1. `.env.local` (UPDATE)
Add these environment variables:

```bash
# Shippo API
SHIPPO_API_TOKEN=your_live_token_here
SHIPPO_TEST_TOKEN=your_test_token_here

# Square Webhook
SQUARE_WEBHOOK_SIGNATURE_KEY=your_signing_key_here

# Notifications
LABEL_NOTIFICATION_EMAIL=kingthriva@gmail.com
```

---

## Shippo API Endpoints We'll Use

### 1. Create Shipment
```
POST https://api.goshippo.com/shipments/
```
**Purpose:** Create shipment with from/to addresses
**Returns:** Rates from all carriers

### 2. Create Transaction (Buy Label)
```
POST https://api.goshippo.com/transactions/
```
**Purpose:** Purchase shipping label
**Returns:** Label PDF URL, tracking number, tracking URL

### 3. Get Tracking
```
GET https://api.goshippo.com/tracks/{carrier}/{tracking_number}
```
**Purpose:** Get real-time tracking updates
**Returns:** Package status, location, ETA

---

## Square API Endpoints We'll Use

### 1. Update Order
```
PUT https://connect.squareup.com/v2/orders/{order_id}
```
**Purpose:** Add tracking number to order
**Updates:** fulfillments.shipment_details.tracking_number

---

## Implementation Steps (Execute Next Session)

### Phase 1: Core Automation (Priority)

**Step 1: Create Shippo Label API Route** (30 min)
- File: `/src/app/api/shippo/create-label/route.ts`
- Logic:
  1. Webhook signature validation
  2. Extract order data
  3. Create Shippo shipment
  4. Buy cheapest rate
  5. Update Square with tracking
  6. Email label PDF

**Step 2: Configure Square Webhook** (5 min)
- Square Dashboard → Webhooks → Add Webhook
- URL: `https://drsebiapproved.com/api/shippo/create-label`
- Event: `order.created`
- Version: Latest

**Step 3: Add Environment Variables** (2 min)
- Copy Shippo API token
- Add to `.env.local`
- Add to Render.com environment variables

**Step 4: Test Flow** (15 min)
- Run test order on site
- Verify webhook triggers
- Check label creation
- Verify Square tracking update
- Check email received

**Total Phase 1:** ~1 hour

---

### Phase 2: Customer Tracking (Optional)

**Step 5: Build Tracking Page** (45 min)
- File: `/src/app/track-order/page.tsx`
- File: `/src/app/api/track-order/route.ts`
- Features:
  - Order lookup by email or order number
  - Live tracking status
  - Carrier info + ETA

**Total Phase 2:** ~45 min

---

## Shippo Label Creation Flow (Detailed)

### Request 1: Create Shipment
```javascript
POST https://api.goshippo.com/shipments/
{
  "address_from": {
    "name": "Dr. Sebi Approved",
    "street1": "Your warehouse address",
    "city": "Your city",
    "state": "TX",
    "zip": "75001",
    "country": "US"
  },
  "address_to": {
    "name": "Customer Name",
    "street1": "Customer address",
    "city": "Customer city",
    "state": "CA",
    "zip": "90001",
    "country": "US",
    "email": "customer@email.com"
  },
  "parcels": [{
    "length": "6",
    "width": "4",
    "height": "2",
    "distance_unit": "in",
    "weight": "12",
    "mass_unit": "oz"
  }]
}
```

**Response:** Returns array of rates from all carriers

---

### Request 2: Purchase Label (Transaction)
```javascript
POST https://api.goshippo.com/transactions/
{
  "rate": "rate_id_from_previous_response",
  "label_file_type": "PDF",
  "async": false
}
```

**Response:**
```javascript
{
  "object_id": "transaction_id",
  "status": "SUCCESS",
  "tracking_number": "9400111899561234567890",
  "tracking_url_provider": "https://tools.usps.com/go/TrackConfirmAction?tLabels=9400111899561234567890",
  "label_url": "https://shippo-delivery.s3.amazonaws.com/label.pdf",
  "commercial_invoice_url": null
}
```

---

## Square Order Update Flow

### Get Order (to get version + fulfillment UID)
```javascript
GET https://connect.squareup.com/v2/orders/{order_id}
```

### Update Order with Tracking
```javascript
PUT https://connect.squareup.com/v2/orders/{order_id}
{
  "idempotency_key": "tracking-{timestamp}",
  "order": {
    "version": current_version,
    "fulfillments": [{
      "uid": fulfillment_uid,
      "state": "COMPLETED",
      "shipment_details": {
        "carrier": "USPS",
        "tracking_number": "9400111899561234567890",
        "tracking_url": "https://tools.usps.com/go/TrackConfirmAction?tLabels=9400111899561234567890"
      }
    }]
  }
}
```

---

## Package Dimensions (Use These Defaults)

Based on your products:

```javascript
const PRODUCT_PARCELS = {
  default: {
    length: "6",
    width: "4",
    height: "2",
    weight: "12",  // 12 oz (covers most single items)
    distance_unit: "in",
    mass_unit: "oz"
  },
  multi_item: {
    length: "8",
    width: "6",
    height: "3",
    weight: "24",  // 1.5 lbs for 2+ items
    distance_unit: "in",
    mass_unit: "oz"
  }
}
```

Logic: Use `multi_item` if order has 2+ products, else use `default`.

---

## Warehouse Address (From Address)

**You need to provide:**
- Business name: "Dr. Sebi Approved" or "Cellularfood Solutions LLC"
- Street address
- City, State, ZIP
- Phone number

Add to `.env.local`:
```bash
WAREHOUSE_NAME="Dr. Sebi Approved"
WAREHOUSE_STREET="Your street address"
WAREHOUSE_CITY="Your city"
WAREHOUSE_STATE="TX"
WAREHOUSE_ZIP="75001"
WAREHOUSE_PHONE="555-555-5555"
```

---

## Error Handling

### Common Errors to Handle:

1. **Invalid Address**
   - Shippo validation fails
   - Log error + email you
   - Don't create label (manual review)

2. **No Rates Available**
   - Rare, but can happen for invalid addresses
   - Fallback: email you for manual handling

3. **Square Update Fails**
   - Label created but Square not updated
   - Log tracking number
   - Retry Square update
   - Email you with manual tracking number

4. **Webhook Signature Invalid**
   - Security check failed
   - Reject request
   - Log attempt

---

## Testing Checklist

### Test Order Flow:
- [ ] Place test order on site ($0.60 test payment)
- [ ] Check dev tools for webhook received
- [ ] Verify Shippo API call succeeded
- [ ] Check label PDF URL returned
- [ ] Verify Square order updated with tracking
- [ ] Check email received with label
- [ ] Verify customer can see tracking in Square

### Edge Cases:
- [ ] Multi-item order (2+ products)
- [ ] Invalid address (should fail gracefully)
- [ ] Duplicate webhook (idempotency check)

---

## Costs Per Label (Reference)

| Order Type | Weight | Shippo Rate | Shippo Fee | Total |
|------------|--------|-------------|------------|-------|
| 1 item | 5-12 oz | $3.26-4.44 | $0.05 | **$3.31-4.49** |
| 2+ items | 1-2 lbs | $7.55-8.45 | $0.05 | **$7.60-8.50** |

---

## Security Notes

1. **Webhook Signature Validation:** Always verify Square webhook signatures
2. **Rate Limiting:** Prevent abuse on webhook endpoint
3. **Idempotency:** Don't create duplicate labels for same order
4. **API Keys:** Never commit to git - use env vars only

---

## Deployment Checklist

### Before Going Live:
- [ ] Add environment variables to Render.com
- [ ] Test with Shippo test API first
- [ ] Verify Square webhook signature works
- [ ] Run 2-3 test orders end-to-end
- [ ] Switch to Shippo live API key
- [ ] Monitor first 5 real orders closely

---

## Monitoring & Logs

**What to log:**
- Every webhook received (order ID, timestamp)
- Shippo API calls (request + response)
- Square update calls (success/failure)
- Errors with full stack trace
- Email notifications sent

**Where to log:**
- Console logs (visible in Render.com)
- Future: Add to Supabase for dashboard

---

## Next Session Prep

**What Ra needs ready:**
1. Shippo API token (live + test)
2. Warehouse shipping address details
3. Square webhook signing key
4. Confirm notification email

**What Claude will do:**
1. Write `/api/shippo/create-label/route.ts`
2. Configure webhook validation
3. Implement label creation logic
4. Add Square tracking updates
5. Set up email notifications
6. Test complete flow

**Time:** 1-2 hours total

---

## Success Criteria

**Phase 1 Complete When:**
- ✅ Customer orders on site
- ✅ Label auto-created in Shippo
- ✅ Label PDF emailed to Ra
- ✅ Tracking auto-updated in Square
- ✅ Customer gets tracking notification
- ✅ Zero manual work required

**Phase 2 Complete When:**
- ✅ Customer can track order on `/track-order` page
- ✅ Real-time status updates shown
- ✅ Professional branded experience

---

## Rollback Plan

If something breaks:
1. Disable Square webhook (stop triggering automation)
2. Create labels manually in Shippo dashboard (fallback)
3. Manually update Square with tracking numbers
4. Debug issue
5. Re-enable webhook after fix

No orders lost - just temporary manual process.

---

**END OF IMPLEMENTATION GUIDE**

Next session: Execute Phase 1, get automated shipping running.
