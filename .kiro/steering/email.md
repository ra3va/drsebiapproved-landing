# Email System - Natural Language Email Sending

## Overview
This project has a fully functional Zoho Mail integration that allows sending emails via natural language commands. You can send emails to anyone, with any content, using conversational requests.

## Capabilities

### 1. Send Custom Emails to Anyone
When the user asks to send an email, parse their natural language request and send via Zoho Mail API.

**Natural Language Examples**:
- "Send an email to john@example.com saying we have a sale"
- "Email carl@zoho.com asking if he received the API credentials"
- "Send kingthriva@gmail.com a message about the OAuth working"
- "Email my team at team@company.com, support@company.com about tomorrow's meeting at 2pm"

### 2. Campaign Emails (8K Customer Win-Back)
Separate system for bulk campaign emails with rate limiting and tracking.

**Campaign Commands**:
- "Send test campaign email to kingthriva@gmail.com"
- "Send batch of 50 campaign emails"
- "Check campaign status"
- "Upload customer CSV"

## How to Send Custom Emails

### Step 1: Parse Natural Language
Extract from user's request:
- **Recipients** (to, cc, bcc)
- **Subject** (or generate from content)
- **Message** (expand if brief)

### Step 2: Generate Professional Email
If user provides brief message, expand into professional format:

```
Hi {name},

{expanded_message}

Best regards,
Dr. Sebi Approved
https://drsebiapproved.com
```

### Step 3: Detect Environment
```bash
# Check if dev server running
if lsof -ti:3000 > /dev/null 2>&1; then
  BASE_URL="http://localhost:3000"
else
  BASE_URL="https://drsebiapproved.com"
fi
```

### Step 4: Send via API
```bash
curl -X POST $BASE_URL/api/zoho/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": ["recipient@example.com"],
    "subject": "Your Subject",
    "htmlContent": "<p>Hi,</p><p>Your message here</p><p>Best regards,<br>Ra</p>",
    "textContent": "Plain text version"
  }'
```

## Natural Language Parsing Patterns

### Extracting Recipients
- "send email to X" → to: [X]
- "email X and Y" → to: [X, Y]
- "send X a message" → to: [X]
- "cc X on this" → cc: [X]
- "bcc X" → bcc: [X]

### Extracting Subject
- "about X" → subject: X
- "regarding X" → subject: X
- "subject: X" → subject: X
- If not specified → generate from message

### Extracting Message
- "saying X" → message: X
- "tell them X" → message: X
- "ask if X" → message: question about X
- "let them know X" → message: X
- "message: X" → message: X

## Content Expansion Examples

### Example 1: Brief Request
**User**: "tell them we have a sale"

**Expand to**:
```
I wanted to let you know that we're currently running a special sale on our 
Dr. Sebi approved products. Check out our website for details!
```

### Example 2: Question
**User**: "ask if he got the credentials"

**Expand to**:
```
I wanted to follow up to see if you received the credentials I sent over. 
Please let me know if you need anything else or have any questions.
```

### Example 3: Announcement
**User**: "let them know the OAuth is working"

**Expand to**:
```
Great news! The OAuth integration is now working successfully. Everything 
is set up and ready to go.
```

## Complete Workflow Example

**User Request**:
```
Send an email to carl@zoho.com and john@example.com about the meeting tomorrow at 2pm
```

**Your Process**:
1. **Parse**:
   - to: ["carl@zoho.com", "john@example.com"]
   - subject: "Meeting Tomorrow - 2pm"
   - message: Meeting reminder

2. **Generate HTML**:
```html
<p>Hi,</p>
<p>I wanted to remind you about our meeting scheduled for tomorrow at 2pm. 
Looking forward to connecting with you then.</p>
<p>Best regards,<br>
Ra Thriva<br>
Dr. Sebi Approved<br>
<a href="https://drsebiapproved.com">drsebiapproved.com</a></p>
```

3. **Detect environment** (localhost or production)

4. **Send via API**:
```bash
curl -X POST $BASE_URL/api/zoho/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": ["carl@zoho.com", "john@example.com"],
    "subject": "Meeting Tomorrow - 2pm",
    "htmlContent": "...",
    "textContent": "..."
  }'
```

5. **Report**:
```
✅ Email sent to 2 recipients: "Meeting Tomorrow - 2pm"
- carl@zoho.com
- john@example.com
```

## API Endpoints

### Custom Email (Ad-hoc)
- **Development**: `POST http://localhost:3000/api/zoho/send-email`
- **Production**: `POST https://drsebiapproved.com/api/zoho/send-email`

**Payload**:
```json
{
  "to": ["email1@example.com", "email2@example.com"],
  "subject": "Your Subject",
  "htmlContent": "<p>HTML email body</p>",
  "textContent": "Plain text version",
  "cc": ["optional@example.com"],
  "bcc": ["optional@example.com"]
}
```

### Campaign Batch
- **Development**: `POST http://localhost:3000/api/campaign/send-batch`
- **Production**: `POST https://drsebiapproved.com/api/campaign/send-batch`

**Payload**:
```json
{
  "batchSize": 50,
  "delaySeconds": 120,
  "dryRun": false
}
```

### Campaign Status
- **Development**: `GET http://localhost:3000/api/campaign/status`
- **Production**: `GET https://drsebiapproved.com/api/campaign/status`

## OAuth Configuration

### Current Status
✅ OAuth tokens stored in Supabase
✅ Access token auto-refreshes every hour
✅ Refresh token stored for long-term access
✅ Sender: info@drsebiapproved.com

### Token Management
- Access tokens expire every 1 hour
- System automatically refreshes using refresh token
- No manual re-authorization needed
- Tokens stored in `zoho_oauth_tokens` table

### Re-authorization (if needed)
Only required if tokens are revoked or deleted:
- Development: `http://localhost:3000/api/auth/zoho/authorize`
- Production: `https://drsebiapproved.com/api/auth/zoho/authorize`

## Environment Variables

Required in `.env.local` and Render:
```bash
# Zoho OAuth
ZOHO_CLIENT_ID=1000.LX1TP0PZWYWGYDOZW18WI13PFHE0IO
ZOHO_CLIENT_SECRET=2b9e297e9a557a1393f902cc68b75cd97189551405
ZOHO_REDIRECT_URI=https://drsebiapproved.com/api/auth/zoho/callback
ZOHO_EMAIL=info@drsebiapproved.com

# Supabase (for token storage)
NEXT_PUBLIC_SUPABASE_URL=https://ohxtngzmyamixwfvisje.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Database Tables

### zoho_oauth_tokens
Stores OAuth access and refresh tokens:
- `user_email`: info@drsebiapproved.com
- `access_token`: Current access token
- `refresh_token`: Long-term refresh token
- `expires_at`: Token expiration time
- `token_type`: Bearer
- `scope`: ZohoMail.messages.CREATE,ZohoMail.accounts.READ

### reengagement_campaign
Campaign customer list:
- `customer_email`: Recipient email
- `customer_name`: Customer name
- `status`: pending | sent | failed | clicked
- `sent_at`: When email was sent
- `clicked_at`: When discount link clicked

### discount_clicks
Click tracking:
- `customer_email`: Who clicked
- `clicked_at`: When they clicked
- `ip_address`: Click source

## Best Practices

### When Sending Custom Emails
1. **Always parse natural language carefully**
2. **Generate professional content** - expand brief messages
3. **Include proper greeting and signature**
4. **Use HTML for formatting** (paragraphs, links, etc.)
5. **Provide plain text fallback**
6. **Detect environment automatically**
7. **Report what was sent** with preview

### When Sending Campaign Emails
1. **Clean test data first** - run `node cleanup-test-emails.js`
2. **Verify recipients** - check campaign status
3. **Use rate limiting** - 50-75 emails/day max
4. **Add delays** - 120 seconds between sends
5. **Monitor deliverability** - check click rates

### Email Content Guidelines
- **Professional tone** for business emails
- **Clear subject lines** that summarize content
- **Concise messages** - get to the point
- **Include CTA** when appropriate
- **Brand signature** - Dr. Sebi Approved + link

## Troubleshooting

### "No OAuth tokens found"
Run authorization flow:
```bash
# Visit in browser
https://drsebiapproved.com/api/auth/zoho/authorize
```

### "Failed to send email"
Check:
1. Is dev server running? `lsof -ti:3000`
2. Are tokens valid? Check Supabase `zoho_oauth_tokens` table
3. Is Supabase connected? Check environment variables

### "Access token expired"
System should auto-refresh. If not:
1. Check refresh token exists in database
2. Verify Zoho credentials in environment variables
3. Re-authorize if needed

## File Locations

### API Routes
- `src/app/api/zoho/send-email/route.ts` - Custom email sender
- `src/app/api/campaign/send-batch/route.ts` - Campaign batch sender
- `src/app/api/campaign/status/route.ts` - Campaign status
- `src/app/api/auth/zoho/authorize/route.ts` - OAuth start
- `src/app/api/auth/zoho/callback/route.ts` - OAuth callback

### Libraries
- `src/lib/zoho.ts` - Zoho Mail API integration
- `src/lib/supabase.ts` - Supabase database client

### Utilities
- `cleanup-test-emails.js` - Remove fake test addresses

## Quick Reference

### Send Email Command Pattern
```
User: "Send email to X saying Y"
You: 
1. Parse: to=[X], message=Y
2. Generate subject from Y
3. Expand Y into professional email
4. Detect environment
5. POST to /api/zoho/send-email
6. Report success
```

### Campaign Command Pattern
```
User: "Send 50 campaign emails"
You:
1. Run cleanup-test-emails.js
2. Check campaign status
3. POST to /api/campaign/send-batch with batchSize=50
4. Report sent/failed counts
```

---

**With this email system, you can send any email to anyone using natural language. Just parse the user's request, generate professional content, and send via the Zoho API.**
