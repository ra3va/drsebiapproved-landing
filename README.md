# Dr. Sebi Approved - Health & Wellness E-Commerce Platform

A Next.js-based e-commerce platform for Dr. Sebi's authentic health products, featuring an optimized mobile-first checkout experience integrated with Square for payment processing and Brevo for intelligent email marketing automation.

## 🌟 Products

- **ParaCleanse Elite** - Two-Phase Parasite Cleansing System ($59.99)
- **Maya Formula** - 26 Herb Iron-Rich Formula ($44.99)
- **Sea Moss Capsules** - Honduran Wildcrafted Sea Moss ($31.99)
- **Mucus Cleanser** - Respiratory & Cellular Cleansing ($31.99)

## 🛠 Tech Stack

- **Framework**: Next.js 14.1.0 with App Router
- **Runtime**: React 18 + TypeScript 5
- **Styling**: Tailwind CSS 3.4.1
- **Payment Processing**: Square Web Payments SDK
- **E-commerce Backend**: Square Catalog & Orders API
- **Email Marketing**: Brevo API (automated campaigns, behavioral tracking)
- **Deployment**: GitHub + Render.com (automatic deployments)
- **Content**: MDX for blog posts
- **Analytics**: Brevo behavioral tracking, Square dashboard

## 📦 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Square Configuration
NEXT_PUBLIC_SQUARE_APPLICATION_ID=your-square-app-id
NEXT_PUBLIC_SQUARE_LOCATION_ID=your-location-id
SQUARE_ACCESS_TOKEN=your-square-access-token

# Brevo Email Marketing (Required)
BREVO_API_KEY=your-brevo-api-key
```

## 🚀 Local Development

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

4. Build for production:
```bash
npm run build
npm run start
```

## 🏗 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── brevo/               # Brevo email marketing endpoints
│   │   │   ├── cart-abandoned/  # Cart abandonment tracking
│   │   │   ├── purchase-complete/ # Purchase tracking
│   │   │   ├── quiz-submit/     # Quiz submission & segmentation
│   │   │   └── track-problem/   # Problem navigation tracking
│   │   └── square/              # Square payment endpoints
│   ├── blog/                    # Blog functionality
│   ├── checkout/                # Checkout pages
│   │   ├── page.tsx            # Main checkout
│   │   └── success/            # Order confirmation
│   ├── quiz/                    # Health assessment quiz
│   ├── paracleanse/            # Product pages
│   ├── maya/
│   ├── seamoss/
│   └── mucus-cleanser/
├── components/                  # React components
│   ├── ui/                     # UI component library
│   ├── ProblemNavigation.tsx   # Problem-based product navigation
│   └── SquareCheckout.tsx      # Main checkout component
├── hooks/                       # Custom React hooks
│   └── useProductTracking.ts   # Behavioral tracking hook
├── lib/                        # Utility libraries
│   ├── blog.ts                # Blog post management
│   ├── brevo-client.js        # Brevo API client
│   └── utils.ts               # General utilities

content/
└── blog/                       # MDX blog posts

docs/
├── brevo-tracking-guide.md     # Brevo tracking documentation
└── square-checkout-integration-details.md

scripts/
├── create-test-coupon.js      # Square coupon creation
└── update-square-prices.js    # Bulk price updates

public/
├── images/                    # Product images
└── [assets]                   # Static assets
```

## 💳 Checkout Features

### Mobile-First Design
- 3-step checkout flow (Contact → Shipping → Payment)
- Compact progress indicator
- Collapsible order summary with product images
- First input field visible immediately (no scrolling)

### Conversion Optimization
- Quantity selector for easy multi-product purchases
- Pre-checkout upsells with complementary products
- Free shipping incentive ($5.95 → FREE for 2+ items)
- Real-time cart updates and total calculation

### Trust & Security
- Payment method icons (Visa, Mastercard, Amex, Discover)
- Social proof ("1,200+ happy customers")
- 30-Day money-back guarantee badge
- 256-bit SSL encryption messaging
- Square secure payment processing

### Square Integration
- Proper Orders API with individual line items
- Inventory tracking per product
- Customer data capture (email, phone, address)
- Shipping address in fulfillment details
- Coupon code support

## 🛒 Shipping Strategy

- **1 item**: $5.95 flat rate
- **2+ items**: FREE shipping
- Encourages multi-product purchases
- Increases average order value (AOV)

## 📊 Square Configuration

### Product Variation IDs
```javascript
{
  'paracleanse': '5JV44RI47GC5IMYSENVXMV3D',
  'maya': 'TWJMT4CUFNFNQKG3S5EQRPLO',
  'seamoss': 'YGDG42LYJKWH75NNW6HPWP5M',
  'mucus-cleanser': '6JARPI34BXU27SS36ZFSEJQP'
}
```

### Test Coupon
- **Code**: TEST99
- **Discount**: 99% off (for testing)
- **Square ID**: PAAUNOPINBLM2RDQFOEQAJNJ

## 🔧 Useful Scripts

### Update Product Prices
```bash
node scripts/update-square-prices.js
```

### Create Test Coupon
```bash
node scripts/create-test-coupon.js
```

## 🚀 Deployment Process

### GitHub Integration with Render.com

The project uses automatic deployments triggered by GitHub pushes:

1. **Make Changes Locally**
```bash
# Make your code changes
npm run dev  # Test locally
npm run build  # Verify production build
```

2. **Commit and Push to GitHub**
```bash
git add .
git commit -m "Your descriptive commit message"
git push origin main
```

3. **Automatic Deployment**
   - Render.com automatically detects the push
   - Builds the Next.js application
   - Deploys to production
   - Usually completes in 2-3 minutes

### Render.com Configuration

**Environment Variables** (set in Render Dashboard):
- `NEXT_PUBLIC_SQUARE_APPLICATION_ID`
- `NEXT_PUBLIC_SQUARE_LOCATION_ID`
- `SQUARE_ACCESS_TOKEN`
- `BREVO_API_KEY` (optional)

**Build Settings:**
- Build Command: `npm install && npm run build`
- Start Command: `npm run start`
- Node Version: 18.x or higher

### Deployment Workflow

```
Local Changes → Git Push → GitHub → Render.com → Production
     ↓              ↓          ↓          ↓            ↓
   Edit Code    Commit    Webhook    Build      Live Site
```

## 🌐 Domain Configuration

- **Primary Domain**: drsebiapproved.com
- **Production URL**: https://drsebiapproved-landing.onrender.com

### DNS Configuration
- Managed through Render.com custom domain settings
- Automatic SSL certificate provisioning
- HTTPS enforced by default

## 📈 Analytics & Tracking

### Brevo Email Marketing & Behavioral Tracking
- **Automated Segmentation**: Contacts sorted by quiz results, product interest, and purchase behavior
- **Quiz Integration**: Symptom-based product recommendations with email capture
- **Cart Abandonment**: Automatic recovery sequences triggered when users leave checkout
- **Purchase Tracking**: Customers added to product-specific lists for targeted follow-ups
- **Problem Navigation**: Track which health concerns visitors click on homepage
- **10 Contact Lists**: Prospect lists (ParaCleanse, Maya, Sea Moss, Mucus Cleanser, Quiz Takers) + Customer lists (per product + Bundle Buyers)
- **25 Custom Attributes**: Quiz scores, severity levels, purchase history, cart data, shipping info

See `docs/brevo-tracking-guide.md` for complete tracking documentation.

### Square Dashboard
- Access order details and line items
- Track inventory per product
- View customer information
- Monitor sales analytics
- Manage fulfillment

### Behavioral Events Tracked
- Quiz starts and completions
- Problem card selections on homepage
- Product page views and engagement time
- CTA clicks and add-to-cart events
- Cart abandonment
- Purchase completion

## 🧪 Testing

### Test Payment Flow
1. Use TEST99 coupon for 99% discount
2. Test with real credit card (charges ~$0.60-$0.90)
3. Verify order appears in Square Dashboard
4. Check customer email receipt
5. Confirm shipping address captured

### Test Scenarios
- Single product purchase
- Multiple products (free shipping)
- Quantity selector (2+ of same product)
- Upsell additions
- Coupon code application
- Mobile responsiveness

## 🐛 Troubleshooting

### Common Issues

**Payment Form Not Loading:**
- Check Square credentials in `.env.local`
- Verify Square SDK script loads (check browser console)
- Disable ad blockers

**Order Not Appearing in Square:**
- Check API logs in Render.com
- Verify location ID is correct
- Ensure Square access token has proper permissions

**Shipping Not Calculating:**
- Check cart items array structure
- Verify quantity values are numbers
- Review shipping logic in SquareCheckout.tsx

### Debug Mode
Check server logs in Render.com for detailed payment processing logs:
- Order creation details
- Payment processing status
- Customer data capture
- Error messages

## 📝 Content Management

### Blog Posts
- Located in `content/blog/`
- Written in MDX format
- Front matter for metadata
- Automatic reading time calculation
- Syntax highlighting for code blocks

### Adding New Blog Post
1. Create new `.mdx` file in `content/blog/`
2. Add front matter:
```mdx
---
title: "Your Post Title"
date: "2025-11-16"
excerpt: "Brief description"
author: "Author Name"
image: "/images/blog-image.jpg"
---
```
3. Write content using Markdown + JSX
4. Images go in `public/images/`

## 🔐 Security

- Square Web Payments SDK for PCI compliance
- No credit card data stored on server
- HTTPS enforced on all pages
- Environment variables for sensitive data
- Server-side API calls for Square access token

## ✅ Recent Major Updates

### Brevo Multi-Product Hub Integration (November 2025)
- ✅ **Multi-Product Navigation**: Problem-based product discovery on homepage
- ✅ **Smart Quiz**: 10-question health assessment with email capture and product recommendations
- ✅ **Automated Email Sequences**: Quiz nurture, cart abandonment recovery, post-purchase follow-ups
- ✅ **Behavioral Tracking**: Complete visitor journey tracking with 9 event types
- ✅ **Customer Segmentation**: 10 automated lists + 25 custom contact attributes
- ✅ **API Integration**: 4 Brevo endpoints for real-time tracking and automation

See `BREVO_MULTI_PRODUCT_INTEGRATION.md` for complete implementation details.

## 🚧 Future Enhancements

### High Priority
- [ ] Build automation sequences in Brevo dashboard (quiz nurture, cart recovery, post-purchase)
- [ ] Exit-intent popup with discount offer
- [ ] Apple Pay / Google Pay integration
- [ ] Estimated delivery date display

### Medium Priority
- [ ] Post-purchase upsell page
- [ ] Customer account system
- [ ] Order tracking page
- [ ] Product reviews and ratings

### Low Priority
- [ ] Live purchase notifications
- [ ] Inventory-based urgency messaging
- [ ] Loyalty program
- [ ] Subscription options

## 📞 Support

**Technical Support:**
- Email: info@drsebiwebsite.com
- Address: 990 Hwy. 287 N, Suite 106 #157, Mansfield, Texas 76063

**Square Support:**
- Dashboard: https://squareup.com/dashboard
- Developer Docs: https://developer.squareup.com

## 📄 License

Proprietary - All rights reserved

## 🙏 Acknowledgments

- Dr. Sebi's legacy and formulas
- Square for payment processing
- Next.js team for the framework
- Tailwind CSS for styling utilities

---

**Last Updated:** November 17, 2025
**Version:** 3.0.0 (Square + Brevo Multi-Product Hub)
**Status:** Production Ready ✅
