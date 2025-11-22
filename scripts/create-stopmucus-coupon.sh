#!/bin/bash

# Create STOPMUCUS coupon (37.5% off for win-back campaign)
ACCESS_TOKEN="${SQUARE_ACCESS_TOKEN}"
API_BASE="https://connect.squareup.com"
SQUARE_VERSION="2025-10-16"

echo ""
echo "Creating STOPMUCUS discount (37.5% off for win-back campaign)..."
echo ""

response=$(curl -s ${API_BASE}/v2/catalog/object \
  -X POST \
  -H "Square-Version: ${SQUARE_VERSION}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H 'Content-Type: application/json' \
  -d "{
    \"idempotency_key\": \"discount-stopmucus-$(date +%s)\",
    \"object\": {
      \"type\": \"DISCOUNT\",
      \"id\": \"#stopmucus\",
      \"discount_data\": {
        \"name\": \"STOPMUCUS\",
        \"discount_type\": \"FIXED_PERCENTAGE\",
        \"percentage\": \"37.5\",
        \"pin_required\": false,
        \"label_color\": \"22c55e\"
      }
    }
  }")

discount_id=$(echo "$response" | jq -r '.catalog_object.id // "FAILED"')
error_msg=$(echo "$response" | jq -r '.errors[0].detail // ""')

if [ "$discount_id" != "FAILED" ] && [ -n "$discount_id" ]; then
  echo "✅ SUCCESS: Created STOPMUCUS discount"
  echo "📋 Discount ID: $discount_id"
  echo ""
  echo "💾 Add this to src/app/api/square/verify-coupon/route.ts:"
  echo "   'STOPMUCUS': '${discount_id}'"
  echo ""
else
  echo "❌ FAILED: Could not create discount"
  [ -n "$error_msg" ] && echo "Error: $error_msg"
  echo ""
  echo "Full response:"
  echo "$response" | jq '.'
fi
