# Zoho Email Campaign Setup Instructions

**FOR CARL**: This document explains exactly what credentials you need to provide to activate the Zoho re-engagement email system.

---

## 🎯 What This System Does

Sends 50-75 win-back emails per day to the 8,000 Dr. Sebi customer list:
- ✅ Rate-limited batch sending (avoids spam flags)
- ✅ Click tracking with embedded discount links
- ✅ Auto-sync clicked customers back to Brevo
- ✅ Comprehensive campaign progress dashboard
- ✅ Professional Dr. Sebi branded email template

---

## 📋 Prerequisites

### 1. Zoho Mail Account
- **Required**: A Zoho Mail account for `info@drsebiapproved.com`
- **Sign up**: https://www.zoho.com/mail/
- **Recommendation**: Use Zoho Mail Lite (free for 1 domain) or Zoho Mail Standard ($1/user/month)
- **Why Zoho**: Better deliverability than Gmail/Outlook for bulk sending, API support included

### 2. Supabase Database Account
- **Required**: Free Supabase account for campaign tracking database
- **Sign up**: https://supabase.com
- **Free tier**: 500 MB database, 2 GB bandwidth/month (more than enough for this)
- **Why Supabase**: Track which customers have been emailed, click rates, Brevo sync status

---

## 🔧 Step 1: Set Up Zoho Mail Account

### 1.1 Create Zoho Mail Organization
1. Go to https://www.zoho.com/mail/
2. Sign up for Zoho Mail
3. Add domain: `drsebiapproved.com`
4. Create email account: `info@drsebiapproved.com`
5. Verify domain ownership (DNS records)

### 1.2 Create Zoho API Console Account
1. Go to https://api-console.zoho.com/
2. Log in with your Zoho Mail account
3. Click **"Get Started"** or **"Add Client"**
4. Choose **"Server-based Applications"**

### 1.3 Configure OAuth Client
Fill in these details:

| Field | Value |
|-------|-------|
| **Client Name** | Dr. Sebi Re-engagement Campaign |
| **Homepage URL** | https://drsebiapproved.com |
| **Authorized Redirect URIs** | https://drsebiapproved.com/api/auth/zoho/callback |

**CRITICAL**: The redirect URI must be EXACT. Copy this exactly:
```
https://drsebiapproved.com/api/auth/zoho/callback
```

### 1.4 Get Credentials
After creating the client, you'll see:
- ✅ **Client ID** (looks like: `1000.XXXXXXXXXXXXXXX`)
- ✅ **Client Secret** (looks like: `xxxxxxxxxxxxxxxxxxxx`)

**Copy these values - you'll need them for the .env.local file**

---

## 🗄️ Step 2: Set Up Supabase Database

### 2.1 Create Supabase Project
1. Go to https://supabase.com
2. Click **"New Project"**
3. Fill in:
   - **Name**: dr-sebi-campaign
   - **Database Password**: (generate strong password - save it!)
   - **Region**: Choose closest to your users (e.g., US East)
4. Wait ~2 minutes for project to be created

### 2.2 Run Database Migration
1. In Supabase Dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Open this file in the project: `prisma/migrations/01_create_zoho_campaign_tables.sql`
4. Copy the entire SQL contents
5. Paste into Supabase SQL Editor
6. Click **"Run"**
7. You should see: "Success. No rows returned"

### 2.3 Get Supabase Credentials
1. In Supabase Dashboard, go to **Settings → API**
2. Copy these values:

| Field | Location | Example |
|-------|----------|---------|
| **Project URL** | Project Settings → API → URL | https://xxxxx.supabase.co |
| **Anon Key** | Project Settings → API → anon public | eyJhbGci... (long string) |

**Copy these values - you'll need them for the .env.local file**

---

## 🔐 Step 3: Update Environment Variables

Open `.env.local` in the project root and replace these placeholder values:

### Zoho Credentials
```env
# Replace PENDING_SETUP with your actual values
ZOHO_CLIENT_ID=YOUR_ZOHO_CLIENT_ID_HERE
ZOHO_CLIENT_SECRET=YOUR_ZOHO_CLIENT_SECRET_HERE

# These should already be correct, but verify:
ZOHO_REDIRECT_URI=https://drsebiapproved.com/api/auth/zoho/callback
ZOHO_EMAIL=info@drsebiapproved.com
```

### Supabase Credentials
```env
# Replace PENDING_SETUP with your actual values
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
```

### Example (with fake values for reference)
```env
# Zoho
ZOHO_CLIENT_ID=1000.ABC123XYZ789EXAMPLE
ZOHO_CLIENT_SECRET=abc123def456ghi789example
ZOHO_REDIRECT_URI=https://drsebiapproved.com/api/auth/zoho/callback
ZOHO_EMAIL=info@drsebiapproved.com

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example
```

---

## ✅ Step 4: Authorize Zoho OAuth (One-Time Setup)

After updating `.env.local`, you need to authorize the app to send emails on behalf of `info@drsebiapproved.com`:

### 4.1 Trigger OAuth Flow
1. Go to: **https://drsebiapproved.com/api/auth/zoho/authorize**
2. You'll be redirected to Zoho login page
3. Log in with the `info@drsebiapproved.com` account
4. Review permissions:
   - ✅ Send emails
   - ✅ Read account info
5. Click **"Accept"** or **"Authorize"**
6. You'll be redirected back to: https://drsebiapproved.com/?success=zoho_connected

### 4.2 Verify Authorization
Check database to confirm tokens were stored:
1. Go to Supabase Dashboard → **Table Editor**
2. Open `zoho_oauth_tokens` table
3. You should see 1 row with:
   - `user_email`: info@drsebiapproved.com
   - `access_token`: (long string)
   - `refresh_token`: (long string)
   - `expires_at`: (timestamp ~1 hour from now)

✅ **If you see this, authorization is complete!**

---

## 📤 Step 5: Upload Customer List

### 5.1 Prepare CSV File
Create a CSV file with 2 columns: `email,name`

**Example format:**
```csv
john@example.com,John Doe
jane@example.com,Jane Smith
bob@example.com,Bob Johnson
```

**Notes:**
- Name column is optional (can be blank)
- One customer per line
- No header row needed
- ~8,000 customers total

### 5.2 Upload via API
Use this API endpoint to upload the CSV:

**Endpoint**: `POST /api/campaign/upload-list`

**Request Body**:
```json
{
  "csvData": "email1@example.com,Customer Name\nemail2@example.com,Another Name\n...",
  "batchSize": 50
}
```

**Example using curl:**
```bash
curl -X POST https://drsebiapproved.com/api/campaign/upload-list \
  -H "Content-Type: application/json" \
  -d '{"csvData": "YOUR_CSV_DATA_HERE", "batchSize": 50}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Successfully uploaded 8000 customers",
  "stats": {
    "total": 8000,
    "uploaded": 8000,
    "totalBatches": 160,
    "batchSize": 50,
    "estimatedDays": 160
  }
}
```

✅ **Customers are now loaded and ready to send!**

---

## 🚀 Step 6: Start Daily Email Campaign

### Option A: Manual Trigger (Recommended for First Test)

Send first batch of 50 emails:
```bash
curl -X POST https://drsebiapproved.com/api/campaign/send-batch \
  -H "Content-Type: application/json" \
  -d '{"batchSize": 50, "delaySeconds": 120, "dryRun": false}'
```

**Dry run test** (doesn't actually send):
```bash
curl -X POST https://drsebiapproved.com/api/campaign/send-batch \
  -H "Content-Type: application/json" \
  -d '{"dryRun": true}'
```

### Option B: Automated Daily Cron Job

Set up a daily cron job to automatically send 50 emails per day.

**Render.com Cron Job** (recommended):
1. Go to Render Dashboard → **Cron Jobs**
2. Click **"New Cron Job"**
3. Configure:
   - **Name**: Dr. Sebi Daily Email Batch
   - **Command**: `curl -X POST https://drsebiapproved.com/api/campaign/send-batch -H "Content-Type: application/json" -d '{"batchSize": 50, "delaySeconds": 120}'`
   - **Schedule**: `0 10 * * *` (10am daily)
4. Save and activate

**Alternative: Vercel Cron** (if using Vercel):
```javascript
// pages/api/cron/send-emails.js
export default async function handler(req, res) {
  const response = await fetch('https://drsebiapproved.com/api/campaign/send-batch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ batchSize: 50, delaySeconds: 120 })
  });

  const data = await response.json();
  res.json(data);
}
```

Then configure in `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/send-emails",
    "schedule": "0 10 * * *"
  }]
}
```

---

## 📊 Step 7: Monitor Campaign Progress

### Check Campaign Status
```bash
curl https://drsebiapproved.com/api/campaign/status
```

**Response:**
```json
{
  "campaign": {
    "total": 8000,
    "progressPercent": "12.50%"
  },
  "status": {
    "pending": 7000,
    "sent": 1000,
    "failed": 0,
    "bounced": 0,
    "clicked": 45
  },
  "engagement": {
    "totalClicks": 45,
    "clickThroughRate": "4.50%",
    "pendingBrevoSync": 0
  },
  "progress": {
    "estimatedDaysRemaining": 140,
    "sentLast24h": 50,
    "dailyRate": 50
  }
}
```

### Useful Queries

**See who clicked (Supabase SQL Editor)**:
```sql
SELECT customer_email, customer_name, clicked_at
FROM reengagement_campaign
WHERE status = 'clicked'
ORDER BY clicked_at DESC;
```

**Check Brevo sync status**:
```sql
SELECT customer_email, clicked_at, added_to_brevo, brevo_synced_at
FROM reengagement_campaign
WHERE clicked_at IS NOT NULL;
```

**Find failed sends**:
```sql
SELECT customer_email, error_message
FROM reengagement_campaign
WHERE status = 'failed';
```

---

## 🎨 Campaign Flow Overview

```
┌──────────────────┐
│ 8,000 Customer   │
│ CSV Upload       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Database         │
│ (50 per batch)   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Daily Batch Send │ ◄─── Cron Job (10am daily)
│ (2-min delays)   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Customer Receives│
│ Win-back Email   │
│ with 20% Discount│
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Customer Clicks  │
│ Discount Link    │
└────────┬─────────┘
         │
         ├──► Track Click (Supabase)
         │
         ├──► Redirect to Product Page
         │
         └──► Auto-sync to Brevo "Re-engaged Customers"
                    │
                    ▼
              ┌─────────────┐
              │ Brevo       │
              │ Sequences   │
              │ Activate    │
              └─────────────┘
```

---

## 🔥 Troubleshooting

### Error: "Zoho not configured"
- Check `.env.local` has real values (not "PENDING_SETUP")
- Restart dev server: `npm run dev`
- Verify Zoho Client ID/Secret are correct

### Error: "Supabase not configured"
- Check `.env.local` has real Supabase URL and key
- Verify Supabase project is active
- Run database migration SQL script again

### Error: "No OAuth tokens found"
- Go to `/api/auth/zoho/authorize` to authorize
- Check `zoho_oauth_tokens` table in Supabase
- Verify redirect URI matches exactly in Zoho API Console

### Error: "Failed to send email"
- Check Zoho Mail account is active
- Verify `info@drsebiapproved.com` exists and has credentials
- Check Zoho API rate limits (200/min)

### No clicks being tracked
- Test tracking URL directly: `/api/campaign/track-click?email=test@example.com&redirect=/`
- Check `discount_clicks` table in Supabase
- Verify Brevo API key is correct

---

## ✅ Final Checklist

Before going live, verify:

- [ ] Zoho Mail account created for `info@drsebiapproved.com`
- [ ] Zoho OAuth client created with correct redirect URI
- [ ] Client ID and Secret added to `.env.local`
- [ ] Supabase project created
- [ ] Database migration run successfully
- [ ] Supabase URL and key added to `.env.local`
- [ ] OAuth authorization completed (`/api/auth/zoho/authorize`)
- [ ] Tokens visible in `zoho_oauth_tokens` table
- [ ] Customer CSV uploaded successfully
- [ ] Test email sent successfully (dry run)
- [ ] Actual email sent and received
- [ ] Click tracking tested
- [ ] Brevo sync working (check "Re-engaged Customers" list)
- [ ] Daily cron job configured
- [ ] Campaign status API working

---

## 📞 Support

If you encounter issues:
1. Check error logs in terminal/console
2. Verify all environment variables are set correctly
3. Test each API endpoint individually
4. Contact Ra with specific error messages

---

## 🎯 Expected Results

**Timeline**: 160 days (8,000 customers ÷ 50 per day)

**Email Deliverability**:
- Target: 95%+ delivery rate
- Expected bounces: <5% (400 emails)
- Spam complaints: <0.1% (<8 emails)

**Engagement Goals**:
- Click-through rate: 3-5% (240-400 clicks)
- Re-opt-ins to Brevo: 200+ customers
- Discount redemptions: 50-100 orders
- Revenue generated: $3,000-6,000

**Domain Reputation**:
- Gradual sending builds trust with email providers
- 2-minute delays mimic human behavior
- Clean list (previous customers only) minimizes spam flags

---

**System is ready to go once you provide the credentials above!**

Need help? Contact Ra.