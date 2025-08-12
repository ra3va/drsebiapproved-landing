# ParaCleanse Elite - Dr. Sebi's Original Two-Phase Parasite Cleansing System

A Next.js-based landing page for Dr. Sebi's ParaCleanse Elite product, integrated with Shopify for e-commerce functionality.

## Tech Stack

- **Frontend**: Next.js 14.1.0
- **Styling**: Tailwind CSS
- **E-commerce**: Shopify Storefront API
- **Deployment**: Docker + Render.com
- **Analytics**: Shopify Analytics

## Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-token
NEXT_PUBLIC_PRODUCT_ID=your-product-id
```

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Deployment Process

### Building and Pushing Docker Image

1. Build the Docker image:
```bash
docker build -t ra3va/parasite-cleanse-landing:latest .
```

2. Push to Docker Hub:
```bash
docker push ra3va/parasite-cleanse-landing:latest
```

### Deploying to Render.com

1. Log into [Render Dashboard](https://dashboard.render.com)
2. Select the web service
3. Under "Settings", ensure these environment variables are set:
   - `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`
   - `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`
   - `NEXT_PUBLIC_PRODUCT_ID`
4. Deploy using the Docker image: `docker.io/ra3va/parasite-cleanse-landing:latest`

## Making Updates

1. Make code changes locally
2. Test using `npm run dev`
3. Build and push new Docker image:
```bash
docker build -t ra3va/parasite-cleanse-landing:latest .
docker push ra3va/parasite-cleanse-landing:latest
```
4. Render will automatically deploy the new version

## Project Structure

```
src/
├── app/                    # Next.js app router pages
├── components/            # React components
├── utils/                 # Utility functions
│   └── shopify.ts        # Shopify API integration
└── styles/               # Global styles
```

## Key Features

- Responsive design
- Shopify integration for e-commerce
- Analytics tracking
- SEO optimization
- Custom domain support

## Domain Configuration

The site is configured to use custom domains:
- Primary domain: drsebiapproved.com
- DNS Configuration:
  - A Record: Points to 216.24.57.1
  - CNAME www: Points to parasite-cleanse-landing-latest.onrender.com

## Analytics

Shopify analytics are integrated and can be accessed through:
1. Shopify Admin Panel → Analytics
2. Reports → Behavior section

Data typically takes 24-48 hours to appear in the dashboard.

## Maintenance

### Regular Tasks
- Monitor Shopify analytics
- Update product information as needed
- Check for dependency updates

### Troubleshooting
- Check Docker build logs for errors
- Verify environment variables in Render.com
- Monitor Render.com deployment logs

## Support

For technical support or questions:
- Email: info@drsebiwebsite.com
- Address: 990 Hwy. 287 N, Suite 106 #157, Mansfield, Texas 76063
