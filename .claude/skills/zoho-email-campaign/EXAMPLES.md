# Zoho Email Campaign - Examples

## Example 1: Simple Test Email

**User Request:**
```
Send a test email to kingthriva@gmail.com
```

**Claude Response:**
1. Run cleanup script
2. Ensure kingthriva@gmail.com in database
3. Send batch of 1
4. Report success

**Expected Output:**
```
✅ Test email sent successfully!

Recipient: kingthriva@gmail.com (Ra Thriva)
Subject: Ra, we miss you! Here's 20% off your favorite Dr. Sebi products
Status: Sent
Remaining in queue: 0

Check your inbox at kingthriva@gmail.com for the win-back email with discount code WELCOME20.
```

## Example 2: Upload CSV and Send Batch

**User Request:**
```
I have a CSV with 100 customers. Upload it and send to the first 10.
```

**CSV Content (customers.csv):**
```csv
john@realstore.com,John Doe
jane@company.com,Jane Smith
bob@business.com,Bob Johnson
...
```

**Claude Response:**
1. Read CSV file
2. Upload via `/api/campaign/upload-list`
3. Clean any test addresses
4. Send batch of 10
5. Report detailed stats

**Expected Output:**
```
✅ Customer list uploaded successfully!

Uploaded: 100 customers
Total in database: 100

🧹 Cleaned test addresses: 0 removed

📧 Sending to first 10 customers...

✅ Batch send complete!

Sent: 10
Failed: 0
Remaining: 90
Estimated completion: 9 days (at 10/day)

Next batch preview:
  1. customer11@example.com (Customer Name)
  2. customer12@example.com (Customer Name)
  ...
```

## Example 3: Check Campaign Status

**User Request:**
```
How's the campaign going? Show me the stats.
```

**Claude Response:**
1. GET `/api/campaign/status`
2. Parse and format response
3. Show comprehensive stats

**Expected Output:**
```
📊 Dr. Sebi Email Campaign Status

Progress: 45.5% (455/1000 customers)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Status Breakdown:
  ✅ Sent: 455 (45.5%)
  ⏳ Pending: 540 (54.0%)
  ❌ Failed: 5 (0.5%)
  🖱️ Clicked: 14 (3.1% CTR)

Engagement:
  Total clicks: 14
  Click-through rate: 3.1%
  Re-engaged customers: 14

Progress:
  Sent in last 24h: 50
  Daily rate: 50 emails/day
  Estimated completion: 11 days

Next batch (first 5):
  1. customer456@example.com (Name)
  2. customer457@example.com (Name)
  3. customer458@example.com (Name)
  4. customer459@example.com (Name)
  5. customer460@example.com (Name)

⚠️ Recommendations:
  - 5 failed sends - check error logs
```

## Example 4: Send Full Batch (50 emails)

**User Request:**
```
Send today's batch of 50 emails
```

**Claude Response:**
1. Check campaign status
2. Clean test addresses
3. Verify 50+ pending customers
4. Send batch with 2-minute delays
5. Report results

**Expected Output:**
```
🧹 Cleaning test addresses first...
✅ Database clean: 0 fake addresses removed

📊 Current status: 540 pending customers

📧 Sending batch of 50 emails...
⏱️ Estimated time: ~100 minutes (2-min delays between sends)

[Progress would show in real-time during send]

✅ Batch complete!

Results:
  ✅ Sent: 50
  ❌ Failed: 0
  ⏳ Remaining: 490

Progress: 51.0% (510/1000 customers)
Estimated completion: 10 days

All emails sent successfully! Campaign is on track.
```

## Example 5: Dry Run Test

**User Request:**
```
Do a test run without actually sending emails
```

**Claude Response:**
1. Clean test addresses
2. Send batch with `dryRun: true`
3. Show what would happen

**Expected Output:**
```
🧪 Running dry run (no emails will be sent)

Next batch would send to:
  1. customer1@example.com (Name 1)
  2. customer2@example.com (Name 2)
  3. customer3@example.com (Name 3)
  ...

✅ Dry run complete!

Would send: 50 emails
Would remain: 950 emails
No actual emails sent.

Ready to send for real? Let me know!
```

## Example 6: Extract Emails from Text

**User Request:**
```
Extract emails from this list and add them to the campaign:

John Doe - john@store.com
Jane Smith <jane@business.com>
Bob: bob@company.com
```

**Claude Response:**
1. Parse text to extract emails
2. Format as CSV
3. Upload to campaign
4. Report results

**Expected Output:**
```
📋 Extracted 3 email addresses:
  1. john@store.com (John Doe)
  2. jane@business.com (Jane Smith)
  3. bob@company.com (Bob)

✅ Added to campaign database!

Total in database: 103 customers
Pending: 93
Ready to send.
```

## Example 7: Emergency Stop (if needed)

**User Request:**
```
Stop the campaign! I need to make changes.
```

**Claude Response:**
1. Explain current batch sends must complete
2. Show how to pause campaign
3. Provide recovery steps

**Expected Output:**
```
⚠️ Campaign pause requested

Current batch status:
  - Batch in progress: No
  - Pending emails: 490
  - Last sent: 5 minutes ago

Campaign is currently idle. No emails are being sent.

To prevent future sends:
  1. Don't trigger /api/campaign/send-batch
  2. Or disable cron job if configured

Need to make changes? I can help with:
  - Updating email template
  - Modifying customer list
  - Adjusting batch size/timing
  - Reviewing sent emails

What changes do you need to make?
```

## Example 8: Check Individual Customer Status

**User Request:**
```
Did we send an email to john@example.com?
```

**Claude Response:**
1. Query campaign database
2. Show customer status
3. Provide click tracking data if available

**Expected Output:**
```
📧 Customer Status: john@example.com

Name: John Doe
Status: ✅ Sent
Sent at: 2025-11-17 14:32:00 UTC
Clicked: Yes (2025-11-17 15:45:00 UTC)
Batch: 5
Zoho Message ID: abc123xyz

Engagement:
  - Opened email: Unknown (Zoho doesn't track opens)
  - Clicked discount link: Yes
  - Added to Brevo: Yes
  - Brevo sync: 2025-11-17 15:45:30 UTC

This customer is re-engaged and in your Brevo list!
```

## Example 9: Re-send to Failed Emails

**User Request:**
```
Retry sending to all failed emails
```

**Claude Response:**
1. Find all failed status emails
2. Reset to pending
3. Send batch
4. Report results

**Expected Output:**
```
🔍 Found 5 failed emails:
  1. bounce@badomain.com (Reason: Invalid domain)
  2. oldaddress@closed.com (Reason: Mailbox full)
  3. ...

⚠️ Warning: 2 emails failed due to invalid domains (will likely fail again)

Reset to pending: 3 emails (skipped invalid domains)

📧 Retrying 3 emails...

✅ Retry complete!

Results:
  ✅ Sent: 2
  ❌ Failed again: 1

The 2 invalid domain addresses have been permanently marked as failed.
```

## Example 10: Export Campaign Results

**User Request:**
```
Export all sent emails with click data to CSV
```

**Claude Response:**
1. Query campaign database
2. Format as CSV
3. Write to file
4. Provide download location

**Expected Output:**
```
📊 Exporting campaign results...

✅ Export complete!

File: campaign-results-2025-11-17.csv
Location: /Users/rathriva/Documents/parasite-cleanse-landing/campaign-results-2025-11-17.csv

Stats:
  Total exported: 455 customers
  Sent: 455
  Clicked: 14 (3.1%)
  Failed: 0

CSV Columns:
  - email
  - name
  - status
  - sent_at
  - clicked_at
  - batch_number

You can import this into Brevo, Mailchimp, or Excel for further analysis.
```
