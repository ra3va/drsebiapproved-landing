# Square Checkout Integration - Technical Details

## Current Checkout Flow

### 1. Customer Data Capture (BEFORE Square Payment)

**When:** Step 1 & 2 of 3-step checkout form  
**Where:** `src/components/SquareCheckout.tsx`

We capture ALL customer data BEFORE processing payment:

```typescript
// Step 1: Contact Information
- email (required)
- fullName (required)
- phone (optional)

// Step 2: Shipping Address
- address (required)
- city (required)
- state (required)
- zipCode (required)
```

### 2. Payment Processing

**When:** Step 3 - User clicks "Complete Order" button  
**Where:** `handlePayment()` function in SquareCheckout.tsx

**Process:**
1. Square Web Payments SDK tokenizes card (client-side)
2. Token + customer data sent to `/api/square/process-payment`
3. Backend creates Square Order with line items
4. Backend processes payment linked to order
5. Backend marks order as paid

### 3. Post-Payment Redirect

**Current Implementation:**
```typescript
onSuccess={() => {
  window.location.href = '/checkout/success'
}}
```

**Important:** Square does NOT redirect. We handle redirect client-side after successful API response.

---

## Available Data After Successful Payment

### From API Response (`/api/square/process-payment`)

```typescript
{
  success: true,
  orderId: "abc123...",        // Square Order ID
  paymentId: "xyz789...",      // Square Payment ID
  message: "Order created and payment processed successfully"
}
```

### Customer Data (Already Captured in Form State)

```typescript
{
  email: string,
  fullName: string,
  phone: string,
  address: {
    addressLine1: string,
    locality: string,           // city
    administrativeDistrictLevel1: string,  // state
    postalCode: string,
    country: "US"
  }
}
```

### Cart/Order Data (Already in Component State)

```typescript
{
  cartItems: [
    {
      id: string,              // e.g., "paracleanse", "maya"
      name: string,            // e.g., "ParaCleanse Elite"
      price: number,           // in cents (5999 = $59.99)
      variationId: string,     // Square catalog variation ID
      quantity: number,
      image: string
    }
  ],
  subtotal: number,            // in cents
  shippingCost: number,        // in cents (595 or 0)
  discount: number,            // in cents
  finalTotal: number,          // in cents
  couponCode: string           // if applied
}
```

---

## Recommendation for Brevo Integration

### Option 1: Call from Success Page (RECOMMENDED)

**Why:** Success page already has access to all data via URL params or localStorage

**Implementation:**
```typescript
// In src/app/checkout/success/page.tsx
useEffect(() => {
  const orderData = getOrderDataFromStorage() // or URL params
  
  // Call Brevo API
  fetch('/api/brevo/purchase-complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: orderData.email,
      firstName: orderData.fullName.split(' ')[0],
      lastName: orderData.fullName.split(' ').slice(1).join(' '),
      productsPurchased: orderData.cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price / 100
      })),
      orderValue: orderData.finalTotal / 100,
      orderId: orderData.orderId,
      shippingAddress: orderData.address
    })
  })
}, [])
```

### Option 2: Call from Backend (ALTERNATIVE)

**Why:** More reliable, no client-side dependency

**Implementation:**
```typescript
// In src/app/api/square/process-payment/route.ts
// After successful payment (line ~230)

if (data.success) {
  // Call Brevo API server-side
  await fetch('http://localhost:3000/api/brevo/purchase-complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: customerDetails.email,
      firstName: customerDetails.name.split(' ')[0],
      lastName: customerDetails.name.split(' ').slice(1).join(' '),
      productsPurchased: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price / 100
      })),
      orderValue: amount / 100,
      orderId: orderId,
      shippingAddress: customerDetails.address
    })
  })
  
  onSuccess?.()
}
```

---

## Data Flow Diagram

```
User Fills Form (Steps 1-2)
  ↓
[email, fullName, phone, address captured]
  ↓
User Enters Card (Step 3)
  ↓
Square SDK Tokenizes Card
  ↓
POST /api/square/process-payment
  {
    sourceId: token,
    amount: finalTotal,
    cartItems: [...],
    customerDetails: {...}
  }
  ↓
Square API: Create Order
  ↓
Square API: Process Payment
  ↓
Response: { success: true, orderId, paymentId }
  ↓
Client: window.location.href = '/checkout/success'
  ↓
Success Page: Call /api/brevo/purchase-complete
```

---

## Key Points for Brevo Integration

1. **Email Capture:** Happens at Step 1 (before payment)
2. **Square Redirect:** None - we handle redirect client-side
3. **Data Availability:** All customer + order data available in component state
4. **Order ID:** Returned from `/api/square/process-payment` response
5. **Best Practice:** Call Brevo from success page OR from backend after payment

---

## Suggested Brevo Endpoint Signature

```typescript
// POST /api/brevo/purchase-complete
{
  email: string,
  firstName: string,
  lastName: string,
  productsPurchased: [
    {
      name: string,
      quantity: number,
      price: number  // in dollars (not cents)
    }
  ],
  orderValue: number,  // in dollars (not cents)
  orderId: string,     // Square Order ID
  shippingAddress: {
    addressLine1: string,
    locality: string,
    administrativeDistrictLevel1: string,
    postalCode: string,
    country: string
  }
}
```

---

## Next Steps

1. Decide: Success page call vs Backend call
2. Pass order data to success page (URL params or localStorage)
3. Create `/api/brevo/purchase-complete` endpoint
4. Test with real purchase flow

Let me know which approach you prefer!
