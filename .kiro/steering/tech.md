# Technology Stack

## Framework & Runtime
- **Next.js 14.1.0** - React framework with App Router
- **React 18** - UI library
- **TypeScript 5** - Type safety and development experience
- **Node.js** - Runtime environment

## Styling & UI
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Tailwind Animate** - Animation utilities
- **@tailwindcss/typography** - Typography plugin for blog content
- **Radix UI** - Accessible component primitives
  - `@radix-ui/react-progress`
  - `@radix-ui/react-select`
  - `@radix-ui/react-toast`
- **Lucide React** - Icon library
- **Framer Motion** - Animation library

## E-commerce & APIs
- **Shopify Storefront API** - E-commerce backend
- **@shopify/shopify-api** - Shopify integration
- **GraphQL Request** - GraphQL client for Shopify API

## Content Management
- **MDX** - Markdown with JSX for blog content
- **next-mdx-remote** - Server-side MDX rendering
- **gray-matter** - Front matter parsing
- **reading-time** - Reading time estimation
- **rehype-prism-plus** - Syntax highlighting
- **rehype-slug** - Heading slug generation

## Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## Deployment
- **Docker** - Containerization
- **Render.com** - Hosting platform

## Common Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Docker Deployment
```bash
docker build -t ra3va/parasite-cleanse-landing:latest .
docker push ra3va/parasite-cleanse-landing:latest
```

## Environment Variables
Required environment variables in `.env.local`:
- `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`
- `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- `NEXT_PUBLIC_PRODUCT_ID`