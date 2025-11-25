Here is a complete technical handover document formatted for your Factory AI Droid.

You can save this as a file named **`META_ADS_HANDOVER.md`** in your root directory, or simply copy and paste the text below directly into your chat with the Droid.

-----

# 🤖 Meta Ads API: Implementation Handover

**To:** Factory AI Droid
**From:** Ra Thriva & Gemini
**Date:** November 25, 2025
**Priority:** High (Token Expiration Pending)

## 1\. Objective

We have successfully validated programmatic access to the **Money Mi$$ion** Ad Account (`26 HM`) using a personal User Token generated via Ra's "Dr. Sebi Approved Ads" app.

**Your Goal:**

1.  Ingest the temporary credentials.
2.  Perform a **Token Exchange** to convert the 1-hour short-lived token into a **60-day long-lived token**.
3.  Update the project environment (`.env.local`).
4.  Create the production scripts (Node.js/Typescript) to manage ads programmatically.

## 2\. Authentication Context

  * **Target Ad Account ID:** `act_789466743256239` (Name: "26 HM")
  * **Meta App Name:** Dr. Sebi Approved Ads
  * **Auth Method:** User Access Token (OAuth)
  * **Permissions Validated:** `ads_management`, `ads_read`
  * **Connection Status:** ✅ Verified. We successfully queried the Ad Account name via Graph API.

## 3\. Required Credentials (Input)

*You (Droid) must request the following values from the user to proceed:*

1.  **Meta App ID:** (From Developers Console -\> Basic Settings)
2.  **Meta App Secret:** (From Developers Console -\> Basic Settings)
3.  **Short-Lived Access Token:** (User will provide the string generated in Graph API Explorer)

## 4\. Implementation Plan

### Step A: Update Environment

Add the following keys to `.env.local`:

```bash
META_APP_ID=...
META_APP_SECRET=...
META_AD_ACCOUNT_ID=act_789466743256239
META_ACCESS_TOKEN=... # This will be the LONG token after Step B
```

### Step B: Token Exchange Script

Since the project stack is **Next.js/Node**, please port the logic from Python to Node.js. Create a script at `scripts/meta/exchange-token.js` that hits this endpoint:

```http
GET https://graph.facebook.com/v19.0/oauth/access_token?
    grant_type=fb_exchange_token&
    client_id={META_APP_ID}&
    client_secret={META_APP_SECRET}&
    fb_exchange_token={SHORT_LIVED_TOKEN}
```

### Step C: Ad Creation Script

Create `scripts/meta/create-test-campaign.js` using the `facebook-nodejs-business-sdk`.

  * **Goal:** Create a campaign named "API Programmatic Test [Droid]".
  * **Status:** `PAUSED`.
  * **Objective:** `OUTCOME_TRAFFIC`.

## 5\. Execution Instructions for Droid

1.  Ask Ra for the **App ID**, **App Secret**, and the **Short Token** immediately (it expires in \~50 mins).
2.  Run the exchange manually or via script.
3.  Save the resulting 60-day token to `.env.local`.
4.  Run the test creation script to confirm write access to account `act_789466743256239`.

-----

### Next Step for You (Ra):

Copy the text above and send it to your Droid. **Be ready to paste your App ID, App Secret, and that long Token string you just copied when he asks for them.**