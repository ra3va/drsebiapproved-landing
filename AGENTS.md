# CLAUDE.md

This file provides guidance to any AI Agent when working with code in this repository.

## Project Overview

Dr. Sebi Approved is a Next.js-based landing page for Dr. Sebi's Original Wellness Systems and Products. This is a premium wellness brand focused on authentic, natural healing products. **Sales are handled via Square API**, while this site serves as marketing/content hub with email campaign management via Zoho Mail API.

### Current Phase: PHASE 2 - Traffic & Marketing (as of Nov 25, 2025)
Phase 1 (Foundation) complete: website, analytics, checkout, PDPs, automation setup, tracking.
Phase 2 focus: Email marketing campaigns, Meta ad content, SEO optimization, split testing for conversions/AOV/LTV.
**Active Campaign**: Black Friday 2025 (Nov 25-30) - 1,180 customer win-back via Zoho.

email: info@drsebiapproved.com
website: https://drsebiapproved.com
send all test emails to: kingthriva@gmail.com, carljoseph@mogulmedianyc.biz, themindsetmarkter@gmail.com, artofthedigitalhustle@gmail.com

## Commands

### Development
```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Create production build
npm run start        # Start production server
npm run lint         # Run ESLint checks
```

### Deployment
```bash
git add .
git commit -m "Your commit message"
git push origin main
# Render.com automatically deploys from GitHub
```

## Architecture & Tech Stack

### Core Technologies
- **Next.js 14.1.0** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** with custom design system
- **Zoho Mail API** for email campaign management
- **Supabase** for campaign database (PostgreSQL)
- **Framer Motion** for animations
- **MDX** for blog content management

### Key Dependencies
- `@supabase/supabase-js` - Database client for campaign tracking
- `@radix-ui/*` - Accessible UI primitives (shadcn/ui)
- `next-mdx-remote` - Dynamic blog content
- `html2canvas` - Screenshot functionality
- `reading-time` - Blog reading time estimation
- `dotenv` - Environment variable management

## Project Structure

```
src/
├── app/                           # Next.js App Router
│   ├── admin/campaign/           # Campaign admin dashboard
│   │   ├── page.tsx              # Main campaign dashboard
│   │   └── components/           # Dashboard components
│   ├── api/campaign/             # Campaign API routes
│   │   ├── status/               # Campaign stats endpoint
│   │   ├── send-batch/           # Batch email sender
│   │   ├── upload-list/          # CSV upload handler
│   │   ├── delete-email/         # Delete individual email
│   │   ├── clear-all/            # Clear all campaign data
│   │   └── track-click/          # Click tracking endpoint
│   ├── api/auth/zoho/            # Zoho OAuth flow
│   ├── blog/[slug]/              # Dynamic blog posts
│   ├── quiz/                     # Interactive health quiz
│   ├── links/                    # Link pages
│   └── page.tsx                  # Main landing page
├── components/
│   ├── ui/                       # Reusable UI components (shadcn/ui)
│   └── Header.tsx                # Main navigation
├── lib/
│   ├── blog.ts                   # Blog content management
│   ├── mdx-components.tsx        # MDX component mapping
│   ├── supabase.ts               # Supabase client config
│   ├── zoho.ts                   # Zoho Mail API client
│   └── utils.ts                  # Shared utilities
├── content/blog/                 # MDX blog posts with frontmatter
├── prisma/migrations/            # Database schema migrations
└── sessions/                     # Claude session logs
```

## Important Patterns

### E-commerce Integration
- **Sales Platform**: Shopify (external, not managed by this codebase)
- **This Site's Role**: Marketing hub, content delivery, email campaign management
- **Customer Journey**: Landing page → Content/Blog → External Shopify checkout
- No payment processing in this codebase (removed Square integration)

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
# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://ohxtngzmyamixwfvisje.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Zoho Mail API (for email campaigns)
ZOHO_CLIENT_ID=your-zoho-client-id
ZOHO_CLIENT_SECRET=your-zoho-client-secret
ZOHO_REDIRECT_URI=http://localhost:3000/api/auth/zoho/callback
ZOHO_FROM_EMAIL=info@drsebiapproved.com
ZOHO_FROM_NAME=Dr. Sebi Approved

# Brevo (optional, for lead magnets)
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

### Zoho Email Campaign Features
- **Admin Dashboard**: `/admin/campaign` - Manage email campaigns
- **Campaign Management**:
  - CSV upload for customer lists
  - Batch sending (rate-limited to avoid spam flags)
  - Multi-stage campaigns (Intro → Follow-up → Urgency)
  - Priority queue system (follow-ups first, then new leads)
- **Tracking Capabilities**:
  - ✅ Click tracking (wrapped URLs)
  - ✅ Conversion tracking (purchase events)
  - ✅ Bounce detection
  - ❌ Email opens (not available on Zoho free tier)
- **Database**: Supabase PostgreSQL with 3 tables:
  - `reengagement_campaign` - Customer records and campaign status
  - `campaign_clicks` - Click tracking data
  - `zoho_oauth_tokens` - OAuth credentials
- **API Routes**: All campaign routes use `export const dynamic = 'force-dynamic'` to prevent caching issues

### Deployment
- GitHub integration with Render.com for automatic deployments
- Hosted on Render.com with custom domain (drsebiapproved.com)
- Static assets optimized through Next.js build process
- Environment variables managed through Render.com dashboard

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
- `zoho-campaign-implementation` - Email campaign system work
- `blog-content-creation` - Adding new MDX blog posts
- `ui-component-development` - Building new interface components
- `deployment-configuration` - GitHub and Render.com setup
- `analytics-implementation` - Tracking and conversion optimization
- `api-caching-and-delete-debugging` - Debugging Next.js caching issues

---

## Critical Technical Notes

### Next.js 14 Caching Behavior
**IMPORTANT**: Next.js 14 App Router caches API routes aggressively by default, even in development mode.

**Symptoms of caching issues:**
- API returns stale data
- Database changes don't reflect in API responses
- DELETE operations appear to fail but actually succeed

**Solution:**
```typescript
// Add to ALL admin/dashboard API routes
export const dynamic = 'force-dynamic';
export const revalidate = 0;
```

**Affected routes:**
- `/api/campaign/status` ✅ Fixed
- `/api/campaign/delete-email` ✅ Fixed
- `/api/campaign/clear-all` ✅ Fixed
- `/api/campaign/send-batch` ✅ Fixed
- `/api/campaign/upload-list` ✅ Fixed

### Supabase Configuration
The admin client must be configured to bypass RLS and prevent session caching:

```typescript
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    db: {
      schema: 'public'
    }
  }
);
```

### Database Delete Patterns
**Best Practice for "delete all" operations:**

```typescript
// ✅ GOOD - Works with any field type
await supabase
  .from('table_name')
  .delete()
  .not('email_field', 'eq', 'impossible-value@never-exists.com');

// ❌ BAD - Type-dependent, can fail with UUID vs INTEGER
await supabase
  .from('table_name')
  .delete()
  .neq('id', someValue);
```

### Known Issues & Solutions

1. **Test Data in Migration**
   - File: `prisma/migrations/01_create_zoho_campaign_tables.sql`
   - Lines 142-153 contain sample INSERT statements
   - Should be commented out for production deployments

2. **Email Campaign Rate Limits**
   - Zoho free tier: 300 emails/day
   - Recommended batch size: 75 emails/day
   - Delay between sends: 120 seconds (2 minutes)

3. **Shopify Integration**
   - Sales handled externally via Shopify
   - No payment processing in this codebase
   - Customer journey: This site → External Shopify checkout