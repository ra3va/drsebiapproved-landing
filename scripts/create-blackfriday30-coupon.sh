#!/bin/bash

# Create BLACKFRIDAY30 coupon (30% off sitewide)
ACCESS_TOKEN="${SQUARE_ACCESS_TOKEN}"
API_BASE="https://connect.squareup.com"
SQUARE_VERSION="2025-10-16"

echo ""
echo "Creating BLACKFRIDAY30 discount (30% off sitewide)..."
echo ""

response=$(curl -s ${API_BASE}/v2/catalog/object \
  -X POST \
  -H "Square-Version: ${SQUARE_VERSION}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H 'Content-Type: application/json' \
  -d "{
    \"idempotency_key\": \"discount-blackfriday30-$(date +%s)\",
    \"object\": {
      \"type\": \"DISCOUNT\",
      \"id\": \"#blackfriday30\",
      \"discount_data\": {
        \"name\": \"BLACKFRIDAY30\",
        \"discount_type\": \"FIXED_PERCENTAGE\",
        \"percentage\": \"30\",
        \"pin_required\": false,
        \"label_color\": \"fbbf24\"
      }
    }
  }")

discount_id=$(echo "$response" | jq -r '.catalog_object.id // "FAILED"')
error_msg=$(echo "$response" | jq -r '.errors[0].detail // ""')

if [ "$discount_id" != "FAILED" ] && [ -n "$discount_id" ]; then
  echo "✅ SUCCESS: Created BLACKFRIDAY30 discount"
  echo "📋 Discount ID: $discount_id"
  echo ""
  echo "💾 Add this to src/app/api/square/verify-coupon/route.ts:"
  echo "   'BLACKFRIDAY30': '${discount_id}'"
  echo ""
else
  echo "❌ FAILED: Could not create discount"
  [ -n "$error_msg" ] && echo "Error: $error_msg"
  echo ""
  echo "Full response:"
  echo "$response" | jq '.'
fi
