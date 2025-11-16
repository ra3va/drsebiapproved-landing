# Square Payment Integration Setup Guide
## Parasite Cleanse Landing - Dr. Sebi Products

**Last Updated:** November 16, 2025
**Status:** Code ported, awaiting Square account setup

---

## Overview

This project now has **complete Square payment integration** ported from the Amber Unbound CRM project. All code is in place and ready to use once you configure your Square account credentials.

### What's Already Done ✅

- ✅ Square SDK installed (`square` npm package)
- ✅ Square client library (`src/lib/square.ts`)
- ✅ Payment API routes (`src/app/api/square/*`)
- ✅ SquareCheckout React component (Dr. Sebi green theme)
- ✅ CLI management scripts for products and coupons
- ✅ Environment variables template ready
- ✅ Complete documentation from Amber project

### What You Need to Do 📋

1. **Create Square Account** (if you don't have one)
2. **Get Square Credentials** (Application ID, Access Token, Location ID)
3. **Configure Environment Variables** (update `.env.local`)
4. **Create Products in Square** (using CLI scripts)
5. **Create Coupons** (using CLI scripts)
6. **Integrate Checkout Components** (replace Shopify on product pages)
7. **Test & Deploy**

---

## Step 1: Create Square Account

**If you already have a Square account, skip to Step 2.**

1. Go to: **https://squareup.com/signup**
2. Sign up for a Square account
3. Complete business verification
4. Add business information

**Note:** You can start with a free Square account. Payment processing fees:
- 2.9% + $0.30 per online transaction
- No monthly fees

---

## Step 2: Get Square Credentials

### 2A. Create Developer Application

1. Go to: **https://developer.squareup.com/apps**
2. Click **"+ Create App"**
3. App Name: `Dr. Sebi Parasite Cleanse`
4. Click **"Save"**

### 2B. Get Application ID

1. In your Square Developer Dashboard
2. Click on your app: `Dr. Sebi Parasite Cleanse`
3. Go to **"Credentials"** tab
4. Copy **Application ID** (starts with `sq0idp-...`)
5. **Save this** - you'll need it for `.env.local`

### 2C. Get Production Access Token

1. Still in **"Credentials"** tab
2. Scroll to **"Production"** section
3. Copy **Production Access Token** (starts with `EAAA...`)
4. **Save this** - you'll need it for `.env.local`

⚠️ **Security Warning:** Never commit this token to git!

### 2D. Get Location ID

1. Go to: **https://squareup.com/dashboard/locations**
2. Click on your location (e.g., "Main Location")
3. Copy the **Location ID** from the URL or settings
4. **Save this** - you'll need it for `.env.local`

---

## Step 3: Configure Environment Variables

Edit your `.env.local` file:

```env
# ============================================
# SQUARE PAYMENT INTEGRATION
# ============================================

# Square Application ID (from Step 2B)
NEXT_PUBLIC_SQUARE_APPLICATION_ID=sq0idp-YOUR_APP_ID_HERE

# Square Access Token (from Step 2C)
SQUARE_ACCESS_TOKEN=EAAA_YOUR_ACCESS_TOKEN_HERE

# Square Environment
SQUARE_ENVIRONMENT=production

# Square Location ID (from Step 2D)
NEXT_PUBLIC_SQUARE_LOCATION_ID=YOUR_LOCATION_ID_HERE
```

**Replace the placeholder values** with your actual credentials from Step 2.

---

## Step 4: Create Products in Square

You have **two options** to create products:

### Option A: Using API Route (Easiest)

```bash
# Start your dev server
npm run dev

# In another terminal, create all 4 products at once:
curl -X POST http://localhost:3000/api/square/setup-catalog \
  -H 'Content-Type: application/json'
```

This will create:
- ParaCleanse Elite ($89.99)
- Maya Formula ($59.99)
- Sea Moss Capsules ($49.99)
- Mucus Cleanser ($59.99)

**Save the Product IDs and Variation IDs** from the response!

### Option B: Using CLI Script

```bash
# Edit the script first to add your access token
nano scripts/manage-products.sh

# Update line 28:
ACCESS_TOKEN="YOUR_ACCESS_TOKEN_HERE"

# Then run:
./scripts/manage-products.sh list
```

---

## Step 5: Create Coupons

### Create Standard Coupons

```bash
# Edit the script first
nano scripts/create-coupons.sh

# Update access token on line 18
ACCESS_TOKEN="YOUR_ACCESS_TOKEN_HERE"

# Run to create coupons
./scripts/create-coupons.sh
```

**Recommended Coupons:**
- `WELCOME15` - 15% off (first-time customers)
- `PARACLEAN20` - 20% off (ParaCleanse Elite promo)
- `SAVE10` - $10 off (general discount)

### Create Test Coupon (99% Off)

```bash
# Edit the test coupon script
nano scripts/create-test-coupon.sh

# Update access token on line 7
ACCESS_TOKEN="YOUR_ACCESS_TOKEN_HERE"

# Run
./scripts/create-test-coupon.sh
```

This creates `TEST99` - a 99% off coupon for testing checkout with minimal cost (around $0.90).

### Update Coupon IDs in Code

After creating coupons, edit `src/app/api/square/verify-coupon/route.ts`:

```typescript
const SQUARE_DISCOUNTS: Record<string, string> = {
  'WELCOME15': 'DISCOUNT_ID_FROM_RESPONSE',
  'PARACLEAN20': 'DISCOUNT_ID_FROM_RESPONSE',
  'SAVE10': 'DISCOUNT_ID_FROM_RESPONSE',
  'TEST99': 'DISCOUNT_ID_FROM_RESPONSE'
}
```

Replace the empty strings with the actual discount IDs returned when you created the coupons.

---

## Step 6: Integrate Checkout Components

### Example: Update a Product Page

Edit your product page (e.g., `src/app/paracleanse/page.tsx`):

```tsx
import SquareCheckout from '@/components/SquareCheckout'

export default function ParaCleanseProductPage() {
  return (
    <div>
      {/* Your existing product page content */}

      {/* Add Square checkout */}
      <SquareCheckout
        productName="ParaCleanse Elite"
        price={8999} // Price in cents ($89.99)
        variationId="VARIATION_ID_FROM_STEP_4" // Replace with actual ID
        onSuccess={() => {
          // Optional: What happens after successful payment
          alert('Payment successful! Check your email for details.')
        }}
      />
    </div>
  )
}
```

**Repeat for all 4 product pages:**
- `/paracleanse` - ParaCleanse Elite ($89.99 = 8999 cents)
- `/maya` - Maya Formula ($59.99 = 5999 cents)
- `/seamoss` - Sea Moss Capsules ($49.99 = 4999 cents)
- `/mucus-cleanser` - Mucus Cleanser ($59.99 = 5999 cents)

---

## Step 7: Test Locally

```bash
# Start dev server
npm run dev

# Open browser to http://localhost:3000
# Navigate to a product page
# Test the checkout:
# 1. Enter test card: 4111 1111 1111 1111
# 2. Expiration: Any future date
# 3. CVV: 111
# 4. ZIP: 12345
# 5. Use TEST99 coupon to reduce cost to $0.90
# 6. Complete payment
```

**Check Square Dashboard** to verify transaction appears.

---

## Step 8: Deploy to Production

### Update Render.com Environment Variables

1. Go to: **https://dashboard.render.com**
2. Select your `parasite-cleanse-landing` service
3. Go to **"Environment"** tab
4. Add these variables:

| Key | Value | Secret? |
|-----|-------|---------|
| `NEXT_PUBLIC_SQUARE_APPLICATION_ID` | Your App ID | No |
| `SQUARE_ACCESS_TOKEN` | Your Access Token | **Yes** |
| `SQUARE_ENVIRONMENT` | `production` | No |
| `NEXT_PUBLIC_SQUARE_LOCATION_ID` | Your Location ID | No |

5. Click **"Save Changes"**
6. Render will automatically redeploy

### Test in Production

1. Visit: **https://drsebiapproved.com**
2. Go to a product page
3. Use `TEST99` coupon
4. Complete a $0.90 test transaction with a real card
5. Verify transaction in Square Dashboard

---

## CLI Scripts Reference

### Product Management

```bash
# List all products
./scripts/manage-products.sh list

# Search products
./scripts/manage-products.sh search "ParaCleanse"

# Update product price
./scripts/manage-products.sh update-price PRODUCT_ID 9999

# Delete product
./scripts/manage-products.sh delete PRODUCT_ID
```

### Coupon Management

```bash
# Create all coupons
./scripts/create-coupons.sh

# Create test coupon
./scripts/create-test-coupon.sh
```

---

## Troubleshooting

### "Payment form blocked" error
- Disable ad blockers
- Check browser console for errors
- Verify `NEXT_PUBLIC_SQUARE_APPLICATION_ID` is set
- Try incognito/private mode

### "Invalid coupon code" error
- Verify coupon ID in `verify-coupon/route.ts`
- Check coupon exists in Square Dashboard
- Ensure `SQUARE_ACCESS_TOKEN` is correct

### Payment fails
- Check `NEXT_PUBLIC_SQUARE_LOCATION_ID` is set
- Verify access token has payment permissions
- Review Render.com logs for detailed errors
- Test with Square test card first

### Build errors
- Run `npm install square` to ensure package is installed
- Check all imports use correct paths (`@/lib/square`)
- Verify environment variables are set
- Run `npm run build` locally to reproduce

---

## Important URLs

- **Square Dashboard:** https://squareup.com/dashboard
- **Square Developer:** https://developer.squareup.com/apps
- **Square Products:** https://squareup.com/dashboard/items/library
- **Square Transactions:** https://squareup.com/dashboard/sales/transactions
- **Square Documentation:** https://developer.squareup.com/docs
- **Render Dashboard:** https://dashboard.render.com

---

## Next Steps After Setup

Once Square integration is working:

1. **Remove Shopify** dependencies:
   ```bash
   npm uninstall @shopify/shopify-api
   rm src/utils/shopify.ts
   ```

2. **Update Render environment** - remove Shopify variables

3. **Email Integration** (optional):
   - Use Brevo API to send payment confirmations
   - Send product delivery emails
   - Set up automated follow-up sequences

4. **Analytics** (optional):
   - Track conversion rates by product
   - Monitor coupon usage
   - Set up Square webhook for real-time updates

---

## Support

For Square-specific issues:
- **Phone:** 1-855-700-6000
- **Docs:** https://developer.squareup.com/docs
- **Community:** https://developer.squareup.com/forums

For implementation questions:
- Review the complete porting guide: `docs/square-porting/README.md`
- Check Amber Unbound CRM reference implementation

---

**Good luck with your Square integration!** 🎉

Once you've completed these steps, you'll have a fully functional payment system for your Dr. Sebi products.
