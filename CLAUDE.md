# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ParaCleanse Elite is a Next.js-based e-commerce landing page for Dr. Sebi's Original Two-Phase Parasite Cleansing System. This is a premium wellness brand focused on authentic, natural healing products with Shopify integration for direct-to-consumer sales.

## Commands

### Development
```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Create production build
npm run start        # Start production server
npm run lint         # Run ESLint checks
```

### Docker Deployment
```bash
docker build -t parasite-cleanse .
docker run -p 3000:3000 parasite-cleanse
# Or use docker-compose for development
docker-compose -f docker-compose.dev.yml up
```

## Architecture & Tech Stack

### Core Technologies
- **Next.js 14.1.0** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** with custom design system
- **Shopify Storefront API** for e-commerce
- **Framer Motion** for animations
- **MDX** for blog content management

### Key Dependencies
- `@shopify/shopify-api` - E-commerce integration
- `@radix-ui/*` - Accessible UI primitives
- `graphql-request` - Shopify API queries
- `next-mdx-remote` - Dynamic blog content
- `html2canvas` - Screenshot functionality
- `reading-time` - Blog reading time estimation

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── blog/[slug]/       # Dynamic blog posts
│   ├── quiz/              # Interactive health quiz
│   ├── links/             # Link pages
│   └── page.tsx           # Main landing page
├── components/
│   ├── ui/                # Reusable UI components (shadcn/ui)
│   ├── Header.tsx         # Main navigation
│   └── ShopifyAnalytics.tsx
├── lib/
│   ├── blog.ts            # Blog content management
│   ├── mdx-components.tsx # MDX component mapping
│   └── utils.ts           # Shared utilities
└── utils/
    └── shopify.ts         # E-commerce API integration
content/blog/              # MDX blog posts with frontmatter
```

## Important Patterns

### Shopify Integration
- Uses GraphQL Storefront API for product data and checkout
- Product IDs configured via environment variables
- Cart creation and management through `src/utils/shopify.ts`
- Analytics tracking with Shopify + Facebook Pixel

### Content Management
- Blog posts are MDX files in `content/blog/` with frontmatter metadata
- Dynamic routing via `app/blog/[slug]/page.tsx`
- Reading time calculation and SEO optimization built-in
- MDX components mapped in `lib/mdx-components.tsx`

### Brand Guidelines (from .cursorrules)
- **Tone**: Authoritative but accessible, educational focus
- **Messaging**: Heritage & authenticity, holistic wellness approach
- **Visual**: Clean layouts, natural imagery, premium positioning
- **Compliance**: Include appropriate health disclaimers

### Design System
- Primary brand color: Green (#22c55e)
- Typography: Inter font family
- Mobile-first responsive design
- Custom Tailwind configuration with CSS variables
- Framer Motion for smooth interactions

## Environment Setup

Required environment variables:
```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token
NEXT_PUBLIC_PRODUCT_ID=your-product-id
```

## Development Notes

### Component Development
- UI components follow shadcn/ui patterns with Radix UI primitives
- Use `cn()` utility for conditional class merging
- Implement proper TypeScript interfaces for all props
- Follow mobile-first responsive design patterns

### Content Creation
- Blog posts use MDX format with frontmatter (title, description, date, tags)
- Images stored in `public/images/` with Next.js Image optimization
- Use structured content for SEO optimization

### E-commerce Features
- Product data fetched via GraphQL from Shopify Storefront API
- Checkout flow redirects to Shopify for secure payment processing
- Analytics tracking implemented for conversion optimization
- Cart functionality uses Shopify's built-in cart management

### Deployment
- Containerized with Docker for consistent deployments
- Hosted on Render.com with custom domain (drsebiapproved.com)
- Static assets optimized through Next.js build process
- Environment variables managed through hosting platform