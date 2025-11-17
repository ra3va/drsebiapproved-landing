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

## Core Capabilities

### 1. Send Test Email
**When to use**: User asks to "send a test email" or "email kingthriva@gmail.com"

**Process**:
1. Ensure only real email addresses in database (no test@example.com)
2. Add recipient to database if not exists
3. Send via `/api/campaign/send-batch` endpoint
4. Report success/failure

**Example request**:
```
Send a test email to kingthriva@gmail.com
```

### 2. Send Batch Emails
**When to use**: User asks to "send emails", "start campaign", or "send batch"

**Process**:
1. Check campaign status via `/api/campaign/status`
2. Verify only real emails in pending queue (no @example.com)
3. Send batch via POST to `/api/campaign/send-batch`
4. Report results (sent count, failed count, remaining)

**API Endpoint**: `POST http://localhost:3000/api/campaign/send-batch`
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
1. Read CSV file (format: `email,name` or just `email`)
2. POST to `/api/campaign/upload-list`
3. Report upload stats

**API Endpoint**: `POST http://localhost:3000/api/campaign/upload-list`
```json
{
  "csvData": "email1@example.com,Name 1\nemail2@example.com,Name 2",
  "batchSize": 50
}
```

### 4. Check Campaign Status
**When to use**: User asks about "campaign status", "how many sent", or "progress"

**API Endpoint**: `GET http://localhost:3000/api/campaign/status`

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

### Send Batch
```bash
curl -X POST http://localhost:3000/api/campaign/send-batch \
  -H "Content-Type: application/json" \
  -d '{"batchSize": 1, "delaySeconds": 0, "dryRun": false}'
```

### Upload List
```bash
curl -X POST http://localhost:3000/api/campaign/upload-list \
  -H "Content-Type: application/json" \
  -d '{"csvData": "email@example.com,Name\n", "batchSize": 50}'
```

### Check Status
```bash
curl http://localhost:3000/api/campaign/status
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

## Best Practices

1. **Always clean first**: Run cleanup-test-emails.js before any send
2. **Verify recipients**: Check campaign status to see who will receive emails
3. **Use dry runs**: Test with `"dryRun": true` before actual sends
4. **Monitor status**: Check `/api/campaign/status` after batch sends
5. **Protect spam rating**: Only send to real, verified email addresses

---

**This skill makes email sending flawless and effortless for Ra's Dr. Sebi campaign.**
