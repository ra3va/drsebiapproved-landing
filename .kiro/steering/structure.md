# Project Structure

## Directory Organization

```
src/
├── app/                    # Next.js App Router pages
│   ├── blog/              # Blog functionality
│   │   └── [slug]/        # Dynamic blog post pages
│   ├── fonts/             # Custom fonts (Geist)
│   ├── links/             # Links page
│   ├── quiz/              # Quiz functionality
│   ├── globals.css        # Global styles and CSS variables
│   ├── layout.tsx         # Root layout with analytics
│   └── page.tsx           # Homepage (main landing page)
├── components/            # Reusable React components
│   ├── ui/               # UI component library (shadcn/ui style)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── progress.tsx
│   ├── Header.tsx        # Site navigation header
│   └── ShopifyAnalytics.tsx
├── lib/                  # Utility libraries
│   ├── blog.ts          # Blog post management
│   ├── mdx-components.tsx # MDX component mappings
│   └── utils.ts         # General utilities
└── utils/               # Business logic utilities
    └── shopify.ts       # Shopify API integration

content/
└── blog/                # MDX blog posts
    ├── 7-signs-of-parasite-infection.mdx
    ├── dr-sebis-approach.mdx
    ├── gut-brain-connection.mdx
    ├── supporting-your-body.mdx
    ├── two-phase-cleansing.mdx
    └── understanding-biofilms.mdx

public/
├── images/              # Static images
│   ├── testimonials/    # Customer testimonial images
│   ├── blog1-6.jpg     # Blog post images
│   ├── cellular.png    # Product image
│   └── [product-image].png
└── [svg-icons]         # Various SVG icons
```

## Key Conventions

### File Naming
- **Components**: PascalCase (e.g., `Header.tsx`, `BlogPostClient.tsx`)
- **Pages**: lowercase with hyphens for routes (e.g., `[slug]/page.tsx`)
- **Utilities**: camelCase (e.g., `blog.ts`, `shopify.ts`)
- **Content**: kebab-case for blog posts (e.g., `dr-sebis-approach.mdx`)

### Component Structure
- UI components follow shadcn/ui patterns in `src/components/ui/`
- Business components in `src/components/`
- Page-specific components co-located with pages when appropriate

### Styling Approach
- Tailwind CSS utility classes
- CSS custom properties defined in `globals.css`
- Component-specific styles using Tailwind
- Responsive design with mobile-first approach

### Content Management
- Blog posts as MDX files in `content/blog/`
- Front matter for metadata (title, date, excerpt, etc.)
- Images stored in `public/images/`
- Static assets served from `public/`

### API Integration
- Shopify integration centralized in `src/utils/shopify.ts`
- GraphQL queries for Shopify Storefront API
- Environment variables for configuration

### TypeScript Patterns
- Strict TypeScript configuration
- Interface definitions for data structures
- Path aliases using `@/*` for `src/*`
- Type-safe API responses and component props