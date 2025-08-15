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

# Brevo Email Marketing API
BREVO_API_KEY=your-brevo-api-key
```

## Brevo API Integration

### Credentials
- **API Key**: Stored in `.env.local` (not committed to repo)
- **MCP API Token**: `eyJhcGlfa2V5IjoieGtleXNpYi04MWM4MmNlYzM5NjQ3Mzk0OGUxMjUxYzBlZDdjNWNkYTU0MGM0ZGM1MWJmMDAxOWJkNjlkMDE4YTlkOTA4Yzg5NS1EYTVlQUNUQk9FOVRhaWhyIfQ==`
- **Verified Sender**: info@drsebiapproved.com ✅
- **Domain Authentication**: drsebiapproved.com ✅ (DKIM + DMARC configured)

### Testing Configuration
- **Test Email**: kingthriva@gmail.com (Ra's email for all testing)

### Free Account Capabilities
- **100,000 contacts** (vs Mailchimp's 500)
- **300 emails/day** (9,000/month vs Mailchimp's 1,000/month)
- **Full API access** with marketing automation
- **Rate limits**: 100 requests/hour general, 10 req/sec for contacts
- **Transactional emails** included for automated PDF delivery

### Lead Magnet Integration
- Email capture via `/api/contacts` endpoint
- Automated welcome series with gut health guide PDF
- Contact segmentation by source (blog, quiz, etc.)
- Webhook triggers for immediate PDF delivery

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

## Session Memory and Context Awareness

**Claude can access previous session context to maintain continuity across conversations.**

### Session History Access
- **Sessions Directory**: `/sessions/` contains detailed logs of all previous work
- **Timestamp Command**: Use `date` terminal command to get current timestamp for context
- **Session Files**: Named with format `YYYY-MM-DD_HH-MM-SS_topic-description.md`

### Context Retrieval Process
1. **Check Current Time**: Run `date` command to understand temporal context
2. **List Recent Sessions**: Use `LS /Users/rathriva/Documents/parasite-cleanse-landing/sessions` to see available logs
3. **Read Relevant Sessions**: Focus on sessions from the last 7-14 days or topic-specific sessions
4. **Extract Key Context**: Previous decisions, ongoing projects, technical implementations, business context

### When to Check Sessions
- **"Start new session" command**: AUTOMATICALLY check 2-3 most recent sessions when user says "start new session"
- **New conversation start**: Always check recent sessions for continuity
- **Project context needed**: When user references previous work or decisions
- **Technical continuity**: When building on previous implementations
- **Business strategy**: When making strategic decisions that need historical context
- **Problem solving**: When troubleshooting issues that may have been addressed before

### Session Startup Protocol
**When user says "start new session":**
1. **Get Current Timestamp**: Run `date` command
2. **List Recent Sessions**: Use `LS` to show available session files  
3. **Read 2-3 Most Recent**: Focus on sessions from last 48-72 hours
4. **Extract Key Context**: Ongoing projects, recent decisions, technical state
5. **Provide Context Summary**: Brief overview of recent work and current status

## Session Logging Protocol

**When user says "end this session" or similar, Claude must immediately log the session.**

### Session Logging Steps
1. **Get Timestamp**: Run `date` command to get current timestamp
2. **Create Sessions Directory**: Ensure `/Users/rathriva/Documents/parasite-cleanse-landing/sessions` exists
3. **Create Session Log**: Write comprehensive session summary to new file

### Session File Naming Convention
```
/Users/rathriva/Documents/parasite-cleanse-landing/sessions/YYYY-MM-DD_HH-MM-SS_topic-description.md
```

### Session Log Structure
```markdown
# [Session Topic] Session
**Date**: [Full timestamp from date command]
**Duration**: [Estimated session length]
**Focus**: [Primary objective/topic]
**Logged by**: Claude

## Session Summary
### Primary Objectives Completed ✅
[List major accomplishments]

## Key Issues Resolved
[Technical problems solved]

## Technical Implementation
[Code changes, architecture decisions]

## Files Modified/Created
### Committed to Production
[Files pushed to GitHub/production]

### Local Development Only
[Local-only files for security]

## Testing Results
[Verification of functionality]

## Business Impact
[Effect on project goals]

## Technical Capabilities Unlocked
[New features/capabilities enabled]

## Next Steps & Recommendations
[Future actions and suggestions]

## Session Outcome
[Final status and results]

---
*End of Session: [timestamp]*
```

### Session Logging Triggers
- User explicitly says: "end this session", "end session", "log this session"
- User asks to "wrap up", "finish up", or "close out"
- User says "goodbye", "done for now", or similar session-ending phrases

### Critical Session Logging Requirements
- **ALWAYS get fresh timestamp** with `date` command
- **Create sessions directory** if it doesn't exist
- **Document all major changes** especially code modifications
- **Note security implications** (what's committed vs local)
- **Include business context** and impact
- **List next steps** for continuity
- **Use descriptive filename** that captures session essence

### Example Session Topics for Filenames
- `shopify-integration-setup` - E-commerce configuration work
- `blog-content-creation` - Adding new MDX blog posts
- `ui-component-development` - Building new interface components
- `deployment-configuration` - Docker and hosting setup
- `analytics-implementation` - Tracking and conversion optimization