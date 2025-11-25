---
name: meta-ads
description: Manage Meta (Facebook/Instagram) Ads programmatically - check performance metrics (ROAS, conversions, spend), create campaigns, ad sets, and ads from natural language requests
---

# Meta Ads Management

## Authentication
- **Ad Account:** `act_789466743256239` (26 HM)
- **Credentials:** `.env.local` contains META_APP_ID, META_APP_SECRET, META_ACCESS_TOKEN
- **Token Expiry:** January 25, 2026 (60-day long-lived token)

## Available Scripts
Located in `scripts/meta/`:
- `check-account.js` - View account status, spend, currency
- `create-test-campaign.js` - Create paused test campaigns
- `exchange-token.js` - Refresh tokens when needed

## API Patterns

### Check Account Status
```bash
node scripts/meta/check-account.js
```

### Get Campaign Performance (Account Level)
```bash
cd /Users/rathriva/Documents/parasite-cleanse-landing && export $(grep -v '^#' .env.local | xargs) && curl -s "https://graph.facebook.com/v19.0/act_789466743256239/insights?fields=campaign_name,spend,impressions,reach,clicks,ctr,cpc,actions&level=campaign&date_preset=last_7d&access_token=$META_ACCESS_TOKEN" | python3 -m json.tool
```

**Note:** Must export env vars inline - dotenv masks tokens in output. Use `level=campaign` to break down by campaign.

### Get All Campaigns
```bash
curl -s "https://graph.facebook.com/v19.0/act_789466743256239/campaigns?fields=id,name,status,objective,daily_budget,lifetime_budget&access_token=$META_ACCESS_TOKEN"
```

### Get Campaign Insights
```bash
curl -s "https://graph.facebook.com/v19.0/{CAMPAIGN_ID}/insights?fields=spend,impressions,reach,clicks,ctr,cpc,actions,cost_per_action_type&date_preset=last_7d&access_token=$META_ACCESS_TOKEN"
```

### Create Campaign
Required fields:
- `name` - Campaign name
- `objective` - OUTCOME_TRAFFIC, OUTCOME_LEADS, OUTCOME_SALES, OUTCOME_AWARENESS
- `status` - PAUSED or ACTIVE
- `special_ad_categories` - [] or ["HOUSING"], ["CREDIT"], etc.
- `is_adset_budget_sharing_enabled` - false (required if not using campaign budget)

```bash
curl -X POST "https://graph.facebook.com/v19.0/act_789466743256239/campaigns" \
  -d "access_token=$META_ACCESS_TOKEN" \
  -d "name=Campaign Name" \
  -d "objective=OUTCOME_TRAFFIC" \
  -d "status=PAUSED" \
  -d "special_ad_categories=[]" \
  -d "is_adset_budget_sharing_enabled=false"
```

### Create Ad Set
```bash
curl -X POST "https://graph.facebook.com/v19.0/act_789466743256239/adsets" \
  -d "access_token=$META_ACCESS_TOKEN" \
  -d "name=Ad Set Name" \
  -d "campaign_id={CAMPAIGN_ID}" \
  -d "daily_budget=1000" \
  -d "billing_event=IMPRESSIONS" \
  -d "optimization_goal=LINK_CLICKS" \
  -d "bid_strategy=LOWEST_COST_WITHOUT_CAP" \
  -d "status=PAUSED" \
  -d 'targeting={"geo_locations":{"countries":["US"]},"age_min":25,"age_max":65}'
```

### Create Ad
```bash
curl -X POST "https://graph.facebook.com/v19.0/act_789466743256239/ads" \
  -d "access_token=$META_ACCESS_TOKEN" \
  -d "name=Ad Name" \
  -d "adset_id={ADSET_ID}" \
  -d "status=PAUSED" \
  -d 'creative={"creative_id":"{CREATIVE_ID}"}'
```

## Key Metrics to Track
- **ROAS** = Purchase Value / Spend
- **CPA** = Spend / Conversions
- **CTR** = Clicks / Impressions
- **CPM** = (Spend / Impressions) * 1000
- **CPC** = Spend / Clicks

## Date Presets
- `today`, `yesterday`
- `last_3d`, `last_7d`, `last_14d`, `last_28d`, `last_30d`
- `this_month`, `last_month`
- `this_quarter`, `last_quarter`
- `this_year`, `last_year`
- `lifetime`

## Common Actions

### "How are my ads performing?"
Fetch account-level insights for last 7 days, calculate ROAS if purchase data available.

### "Create a traffic campaign for [product]"
1. Create campaign with OUTCOME_TRAFFIC objective (PAUSED)
2. Create ad set with targeting and budget
3. Create ad with creative
4. Report IDs back to user for review before activating

### "Pause/activate campaign X"
```bash
curl -X POST "https://graph.facebook.com/v19.0/{CAMPAIGN_ID}" \
  -d "access_token=$META_ACCESS_TOKEN" \
  -d "status=PAUSED"  # or ACTIVE
```

### "What's my spend this month?"
Fetch insights with date_preset=this_month, return spend field.

## Error Handling
- Token expired: Run `node scripts/meta/exchange-token.js <NEW_SHORT_TOKEN>`
- Rate limits: Meta allows 200 calls/hour per ad account
- Invalid parameter: Check required fields (especially `is_adset_budget_sharing_enabled`)
- **Dotenv masking:** Don't use `source .env.local` - tokens get masked. Use `export $(grep -v '^#' .env.local | xargs)` instead
- **JSON parsing errors:** Always pipe to `python3 -m json.tool` for readable output
- **Filtering errors:** Avoid complex filtering params - use `level=campaign` for breakdowns instead
