---
name: zoho-email-campaign
description: Send emails via Zoho Mail API for Dr. Sebi re-engagement campaign. Use when user asks to send emails, test emails, send batch emails, upload customer lists, or manage the email campaign. Handles single emails, bulk sends, CSV imports, and campaign status checks.
allowed-tools: Read, Write, Bash, Glob, Grep
---

# Zoho Email Campaign Skill

Comprehensive email campaign management for the Dr. Sebi Approved 8K customer win-back campaign using Zoho Mail API.

## What This Skill Does

- Send test emails to specific recipients (always safe for spam rating)
- Send batch emails from the campaign database
- Upload customer lists from CSV files
- Check campaign status and progress
- Clean up test/fake email addresses
- Track email clicks and engagement

## Environment Detection

**CRITICAL**: Automatically detect whether to use localhost or production:

- **Development**: `http://localhost:3000` (when dev server is running)
- **Production**: `https://drsebiapproved.com` (for live campaign sends)

**Auto-detection logic**:
1. Check if port 3000 is active: `lsof -ti:3000`
2. If active → use `http://localhost:3000`
3. If not active → use `https://drsebiapproved.com`

**User can override** by specifying:
- "Send via localhost"
- "Send via production"
- "Use production URL"

## Core Capabilities

### 1. Send Test Email
**When to use**: User asks to "send a test email" or "email kingthriva@gmail.com"

**Process**:
1. Detect environment (localhost or production)
2. Ensure only real email addresses in database (no test@example.com)
3. Add recipient to database if not exists
4. Send via `/api/campaign/send-batch` endpoint
5. Report success/failure

**Example request**:
```
Send a test email to kingthriva@gmail.com
```

### 2. Send Batch Emails
**When to use**: User asks to "send emails", "start campaign", or "send batch"

**Process**:
1. Detect environment (localhost or production)
2. Check campaign status via `/api/campaign/status`
3. Verify only real emails in pending queue (no @example.com)
4. Send batch via POST to `/api/campaign/send-batch`
5. Report results (sent count, failed count, remaining)

**API Endpoint**:
- Development: `POST http://localhost:3000/api/campaign/send-batch`
- Production: `POST https://drsebiapproved.com/api/campaign/send-batch`

```json
{
  "batchSize": 50,
  "delaySeconds": 120,
  "dryRun": false
}
```

### 3. Upload Customer CSV
**When to use**: User provides CSV file or asks to "upload customer list"

**Process**:
1. Detect environment (localhost or production)
2. Read CSV file (format: `email,name` or just `email`)
3. POST to `/api/campaign/upload-list`
4. Report upload stats

**API Endpoint**:
- Development: `POST http://localhost:3000/api/campaign/upload-list`
- Production: `POST https://drsebiapproved.com/api/campaign/upload-list`

```json
{
  "csvData": "email1@example.com,Name 1\nemail2@example.com,Name 2",
  "batchSize": 50
}
```

### 4. Check Campaign Status
**When to use**: User asks about "campaign status", "how many sent", or "progress"

**API Endpoint**:
- Development: `GET http://localhost:3000/api/campaign/status`
- Production: `GET https://drsebiapproved.com/api/campaign/status`

Returns:
- Total customers
- Sent/pending/failed counts
- Click-through rate
- Next batch preview
- Estimated days remaining

### 5. Clean Test Data
**When to use**: Before any email sends, automatically clean fake addresses

**Process**:
1. Run cleanup script: `node cleanup-test-emails.js`
2. Removes all @example.com addresses
3. Keeps only real email addresses
4. Protects spam rating

**Critical**: ALWAYS run this before sending emails unless user explicitly wants to keep test data.

## Important Rules

### Spam Protection
1. **NEVER send to fake email addresses** (test@example.com, etc.)
2. **ALWAYS clean test data** before batch sends
3. **ALWAYS verify recipients** are real before sending
4. **Only send to kingthriva@gmail.com** for tests unless user specifies otherwise

### Error Handling
1. If API returns error, check:
   - Is dev server running? (`lsof -ti:3000`)
   - Are Zoho tokens valid? (check `/api/campaign/status`)
   - Is Supabase connected?
2. Provide clear error messages to user
3. Don't retry failed sends without user confirmation

### File Locations
- **Cleanup script**: `cleanup-test-emails.js` (project root)
- **API routes**: `src/app/api/campaign/`
- **Zoho lib**: `src/lib/zoho.ts`
- **Supabase lib**: `src/lib/supabase.ts`

## API Routes Reference

**Base URLs**:
- Development: `http://localhost:3000`
- Production: `https://drsebiapproved.com`

Use `$BASE_URL` variable based on environment detection.

### Send Batch
```bash
# Development
curl -X POST http://localhost:3000/api/campaign/send-batch \
  -H "Content-Type: application/json" \
  -d '{"batchSize": 1, "delaySeconds": 0, "dryRun": false}'

# Production
curl -X POST https://drsebiapproved.com/api/campaign/send-batch \
  -H "Content-Type: application/json" \
  -d '{"batchSize": 1, "delaySeconds": 0, "dryRun": false}'
```

### Upload List
```bash
# Development
curl -X POST http://localhost:3000/api/campaign/upload-list \
  -H "Content-Type: application/json" \
  -d '{"csvData": "email@example.com,Name\n", "batchSize": 50}'

# Production
curl -X POST https://drsebiapproved.com/api/campaign/upload-list \
  -H "Content-Type: application/json" \
  -d '{"csvData": "email@example.com,Name\n", "batchSize": 50}'
```

### Check Status
```bash
# Development
curl http://localhost:3000/api/campaign/status

# Production
curl https://drsebiapproved.com/api/campaign/status
```

## Workflow Examples

### Example 1: Send Test Email
```
User: "Send a test email to kingthriva@gmail.com"

Steps:
1. Run cleanup-test-emails.js to remove fake addresses
2. Verify kingthriva@gmail.com is in database
3. If not, add via upload-list endpoint
4. Send via send-batch with batchSize=1
5. Report: "✅ Test email sent to kingthriva@gmail.com"
```

### Example 2: Upload CSV and Send
```
User: "Upload this CSV and send to the first 10 customers"
[provides customers.csv file]

Steps:
1. Read CSV file
2. POST to /api/campaign/upload-list
3. Run cleanup-test-emails.js
4. POST to /api/campaign/send-batch with batchSize=10
5. Report upload and send statistics
```

### Example 3: Check Progress
```
User: "How's the email campaign going?"

Steps:
1. GET /api/campaign/status
2. Parse response
3. Report:
   - "Campaign Progress: 45% (450/1000 sent)"
   - "Click-through rate: 3.2%"
   - "Next batch: 5 customers pending"
   - "Estimated completion: 20 days"
```

## Email Template Details

The email sent includes:
- **Subject**: "{Name}, we miss you! Here's 20% off your favorite Dr. Sebi products"
- **From**: Dr. Sebi Approved <info@drsebiapproved.com>
- **Discount Code**: WELCOME20 (20% off)
- **CTA**: Tracked link to product page
- **Tracking**: Clicks tracked via `/api/campaign/track-click`

## Database Tables

### reengagement_campaign
- `customer_email`: Recipient email (unique)
- `customer_name`: Customer name
- `status`: pending | sent | failed | bounced | clicked
- `sent_at`: When email was sent
- `clicked_at`: When discount link was clicked
- `batch_number`: Batch assignment for rate limiting

### zoho_oauth_tokens
- `user_email`: info@drsebiapproved.com
- `access_token`: OAuth access token (auto-refreshes)
- `refresh_token`: OAuth refresh token
- `expires_at`: Token expiration time

### discount_clicks
- `customer_email`: Who clicked
- `clicked_at`: When they clicked
- `ip_address`: Click source IP
- `utm_params`: Campaign tracking

## Troubleshooting

### "Zoho not configured"
- Check `.env.local` has ZOHO_CLIENT_ID and ZOHO_CLIENT_SECRET
- Restart dev server

### "No OAuth tokens found"
- Visit: `http://localhost:3000/api/auth/zoho/authorize`
- Complete OAuth flow
- Tokens will be saved to Supabase

### "Supabase not configured"
- Check `.env.local` has NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
- Verify Supabase project is active

### Dev server not running
```bash
npm run dev
```

## Success Criteria

After using this skill, the user should:
1. ✅ Have emails sent successfully
2. ✅ Have no fake addresses in database
3. ✅ See clear confirmation of what was sent
4. ✅ Have campaign status updated
5. ✅ Experience zero errors or friction

## Environment Detection Helper

Before every API call, detect the environment:

```bash
# Check if dev server is running
if lsof -ti:3000 > /dev/null 2>&1; then
  BASE_URL="http://localhost:3000"
  ENV="Development"
else
  BASE_URL="https://drsebiapproved.com"
  ENV="Production"
fi

echo "Using $ENV environment: $BASE_URL"
```

Then use `$BASE_URL` in all API calls.

**When to force production**:
- User explicitly says "production" or "live"
- Scheduled cron jobs (always production)
- User says "send to real customers" (implies production)

**When to use localhost**:
- Dev server is confirmed running
- User says "test locally" or "localhost"
- Development/debugging scenarios

## Best Practices

1. **Always clean first**: Run cleanup-test-emails.js before any send
2. **Verify recipients**: Check campaign status to see who will receive emails
3. **Use dry runs**: Test with `"dryRun": true` before actual sends
4. **Monitor status**: Check `/api/campaign/status` after batch sends
5. **Protect spam rating**: Only send to real, verified email addresses
6. **Auto-detect environment**: Check port 3000 before every operation
7. **Confirm production sends**: Always confirm with user before production batch sends

## Environment Examples

### Example 1: Auto-detect and send
```
User: "Send a test email to kingthriva@gmail.com"

Steps:
1. Check if port 3000 is active
2. If yes → use localhost, if no → use production
3. Inform user: "Using Development environment (localhost:3000)"
4. Send email
```

### Example 2: Force production
```
User: "Send 50 emails on production"

Steps:
1. Force BASE_URL=https://drsebiapproved.com
2. Inform user: "Using Production environment (drsebiapproved.com)"
3. Confirm: "Ready to send 50 real emails via production. Proceed?"
4. After confirmation, send batch
```

---

**This skill makes email sending flawless and effortless for Ra's Dr. Sebi campaign across both development and production environments.**
