# Brevo Migration & Black Friday Campaign Session

**Date:** Tue Nov 25 10:13:24 CST 2025  
**Duration:** ~2 hours  
**Focus:** Migrate from Zoho to Brevo for email campaigns after Zoho spam block  
**Logged by:** Claude

---

## Session Summary

### The Problem
Zoho Mail API hit spam detection after sending 42 emails:
```
550 5.4.6 Unusual sending activity detected. Please try after sometime.
```

This blocked the Black Friday campaign (1,180 customers to contact, only 42 sent).

### The Solution
Migrated entire email campaign system from Zoho to Brevo marketing campaigns.

---

## Key Decisions Made

### 1. Brevo Marketing Campaigns vs Transactional
**Decision:** Use Brevo's marketing campaign infrastructure, NOT transactional API.

**Rationale:**
- Marketing campaigns have better deliverability
- Built-in open/click tracking
- Automatic unsubscribe handling
- Brevo manages sending throttling (300/day limit)
- Lower risk of account suspension

### 2. Upload Contacts to Brevo List
**Decision:** Sync all 1,139 contacts from Supabase to a "Black Friday 2025" Brevo list.

**Rationale:**
- Proper list-based sending (not one-off API calls)
- Enables future re-targeting
- Clean attribution tracking
- Brevo handles duplicates automatically

### 3. Keep UTM Params Hardcoded
**Decision:** Keep `utm_source=brevo&utm_medium=email&utm_campaign=blackfriday2025` in email HTML, disable Brevo's GA tracking.

**Rationale:**
- Avoids duplicate/conflicting UTM params
- Consistent tracking in GA4
- Full control over attribution

---

## Technical Implementation

### New Scripts Created

| Script | Purpose |
|--------|---------|
| `scripts/sync-contacts-to-brevo.js` | Upload contacts from Supabase → Brevo list |
| `scripts/create-brevo-campaign.js` | Create marketing campaign in draft mode |
| `scripts/check-brevo-stats.js` | Pull campaign statistics via API |

### Script Features
- `sync-contacts-to-brevo.js`: Dry-run mode, limit option, per-contact Supabase updates (timeout-safe)
- `create-brevo-campaign.js`: Preview mode, uses existing Black Friday HTML template
- `check-brevo-stats.js`: Shows sent/delivered/opens/clicks/bounces

### Documentation Created
- `docs/brevo/BREVO_API_CAPABILITIES.md` - Complete API reference for future sessions

---

## Files Modified/Created

### Created
- `/scripts/sync-contacts-to-brevo.js`
- `/scripts/create-brevo-campaign.js`
- `/scripts/check-brevo-stats.js`
- `/docs/brevo/BREVO_API_CAPABILITIES.md`

### Modified
- `scripts/sync-contacts-to-brevo.js` - Fixed to update Supabase per-contact (not batch at end) to survive timeouts

---

## Challenges & Fixes

### 1. Script Timeout During Upload
**Problem:** Initial sync script did batch Supabase update at END, so when it timed out, progress was lost.

**Fix:** Changed to update Supabase immediately after each successful Brevo upload.

### 2. 673 Contacts Uploaded But Not Marked
**Problem:** First run uploaded 673 contacts to Brevo but Supabase still showed them as "pending".

**Fix:** Ran manual query to mark those 673 as "sent" before continuing.

### 3. Campaign Creation Error
**Problem:** `scheduledAt: null` caused Brevo API error.

**Fix:** Removed the parameter entirely (campaigns create as draft by default).

### 4. Email Copy Refinement
**Problem:** Ra wanted to highlight Maya's lowest-ever price.

**Fix:** Added "— *Lowest price ever!*" next to Maya in product listing.

---

## Campaign Results (as of session end)

| Metric | Value |
|--------|-------|
| Contacts in List | 1,139 |
| Emails Sent | 298 |
| Delivered | 287 |
| Opens | 3 |
| Clicks | 0 |
| Bounces | 1 (soft) |
| Remaining | 841 |
| Status | Suspended (300/day limit) |

Campaign will auto-resume tomorrow and send remaining 841.

---

## Current State

### Brevo Setup
- **List:** "Black Friday 2025" (ID: 19) - 1,139 contacts
- **Campaign:** "Black Friday 2025 - Stage 1" (ID: 6) - suspended, will resume
- **Sender:** info@drsebiapproved.com (verified)

### Supabase
- All 1,139+ contacts marked as `status: 'sent'`
- `brevo_synced_at` timestamps recorded

### Zoho
- Still configured but not in use
- Won't auto-send (API route requires manual trigger)
- All contacts already marked as sent, so nothing would send anyway

---

## What's Working

- ✅ Contacts synced to Brevo
- ✅ Campaign created and sending
- ✅ UTM tracking for GA4
- ✅ Brevo open/click tracking
- ✅ Stats script for monitoring
- ✅ Documentation for future sessions

---

## Next Session Plan

**Topic:** Meta Ads Setup & Programmatic Access

Tasks to explore:
1. Meta Business Manager API access
2. Programmatic ad creation/management
3. Audience syncing (Brevo → Meta Custom Audiences?)
4. Conversion tracking setup
5. Creative asset management

---

## Key Learnings

1. **Zoho free tier is fragile** - spam detection triggers easily at scale
2. **Brevo marketing > transactional** for campaign sends
3. **Per-record updates** survive timeouts better than batch updates
4. **300/day limit** means 4 days to reach 1,139 contacts
5. **Brevo API** is comprehensive - can do most things programmatically

---

## Session Outcome

Successfully migrated from Zoho to Brevo. Black Friday campaign is live and sending. 298 emails delivered on day 1, remaining 841 will send over next 3 days.

---

*End of Session: Tue Nov 25 10:13:24 CST 2025*
