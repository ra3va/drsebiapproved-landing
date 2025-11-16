#!/bin/bash

# Create TEST99 coupon - 99% off for testing checkout in production
# Parasite Cleanse Landing (Dr. Sebi Products)

# TODO: Replace with Carl's Square Production Access Token
ACCESS_TOKEN="YOUR_SQUARE_ACCESS_TOKEN_HERE"
TIMESTAMP=$(date +%s)

echo "Creating TEST99 coupon (99% off for testing)..."
echo ""

curl https://connect.squareup.com/v2/catalog/object \
  -X POST \
  -H 'Square-Version: 2025-10-16' \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H 'Content-Type: application/json' \
  -d "{
    \"idempotency_key\": \"discount-test99-${TIMESTAMP}\",
    \"object\": {
      \"type\": \"DISCOUNT\",
      \"id\": \"#test99\",
      \"discount_data\": {
        \"name\": \"TEST99\",
        \"discount_type\": \"FIXED_PERCENTAGE\",
        \"percentage\": \"99\",
        \"pin_required\": false
      }
    }
  }" | jq '.'
