#!/bin/bash

###############################################################################
# Square Coupon Creator - Parasite Cleanse Landing (Dr. Sebi Products)
#
# This script creates discount coupons in Square production catalog.
# Coupons can be percentage-based or fixed-amount.
#
# Usage:
#   1. Uncomment the coupon examples below OR add your own
#   2. Run: ./scripts/create-coupons.sh
#   3. Copy the returned discount ID
#   4. Add to src/app/api/square/verify-coupon/route.ts
###############################################################################

# TODO: Replace with Carl's Square Production Access Token
# Get from: https://developer.squareup.com/apps → Your App → Credentials
ACCESS_TOKEN="YOUR_SQUARE_ACCESS_TOKEN_HERE"
API_BASE="https://connect.squareup.com"
SQUARE_VERSION="2025-10-16"

echo ""
echo "═══════════════════════════════════════════════════════"
echo "  Square Coupon Creator - Dr. Sebi Products"
echo "═══════════════════════════════════════════════════════"
echo ""

###############################################################################
# FUNCTION: Create Percentage Discount
# Usage: create_percentage_discount "CODE" "percentage" "color"
###############################################################################
create_percentage_discount() {
  local code=$1
  local percentage=$2
  local color=${3:-"#7851A9"}  # Default purple

  echo "📝 Creating Percentage Discount: $code ($percentage% off)"

  response=$(curl -s ${API_BASE}/v2/catalog/object \
    -X POST \
    -H "Square-Version: ${SQUARE_VERSION}" \
    -H "Authorization: Bearer ${ACCESS_TOKEN}" \
    -H 'Content-Type: application/json' \
    -d "{
      \"idempotency_key\": \"discount-${code,,}-$(date +%s)\",
      \"object\": {
        \"type\": \"DISCOUNT\",
        \"id\": \"#${code,,}\",
        \"discount_data\": {
          \"name\": \"${code}\",
          \"discount_type\": \"FIXED_PERCENTAGE\",
          \"percentage\": \"${percentage}\",
          \"pin_required\": false,
          \"label_color\": \"${color}\"
        }
      }
    }")

  # Parse response
  discount_id=$(echo "$response" | jq -r '.catalog_object.id // "FAILED"')
  error_msg=$(echo "$response" | jq -r '.errors[0].detail // ""')

  if [ "$discount_id" != "FAILED" ] && [ -n "$discount_id" ]; then
    echo "  ✅ SUCCESS: Created discount"
    echo "  📋 Discount ID: $discount_id"
    echo "  💾 Add to verify-coupon/route.ts:"
    echo "     '${code}': '${discount_id}'"
    echo ""
  else
    echo "  ❌ FAILED: Could not create discount"
    [ -n "$error_msg" ] && echo "  Error: $error_msg"
    echo ""
  fi
}

###############################################################################
# FUNCTION: Create Fixed Amount Discount
# Usage: create_fixed_discount "CODE" amount_in_cents "color"
###############################################################################
create_fixed_discount() {
  local code=$1
  local amount=$2  # in cents (e.g., 1000 = $10.00)
  local color=${3:-"#7851A9"}  # Default purple
  local amount_display=$(echo "scale=2; $amount/100" | bc)

  echo "📝 Creating Fixed Discount: $code (\$${amount_display} off)"

  response=$(curl -s ${API_BASE}/v2/catalog/object \
    -X POST \
    -H "Square-Version: ${SQUARE_VERSION}" \
    -H "Authorization: Bearer ${ACCESS_TOKEN}" \
    -H 'Content-Type: application/json' \
    -d "{
      \"idempotency_key\": \"discount-${code,,}-$(date +%s)\",
      \"object\": {
        \"type\": \"DISCOUNT\",
        \"id\": \"#${code,,}\",
        \"discount_data\": {
          \"name\": \"${code}\",
          \"discount_type\": \"FIXED_AMOUNT\",
          \"amount_money\": {
            \"amount\": ${amount},
            \"currency\": \"USD\"
          },
          \"pin_required\": false,
          \"label_color\": \"${color}\"
        }
      }
    }")

  # Parse response
  discount_id=$(echo "$response" | jq -r '.catalog_object.id // "FAILED"')
  error_msg=$(echo "$response" | jq -r '.errors[0].detail // ""')

  if [ "$discount_id" != "FAILED" ] && [ -n "$discount_id" ]; then
    echo "  ✅ SUCCESS: Created discount"
    echo "  📋 Discount ID: $discount_id"
    echo "  💾 Add to verify-coupon/route.ts:"
    echo "     '${code}': '${discount_id}'"
    echo ""
  else
    echo "  ❌ FAILED: Could not create discount"
    [ -n "$error_msg" ] && echo "  Error: $error_msg"
    echo ""
  fi
}

###############################################################################
# FUNCTION: Create Capped Percentage Discount
# Usage: create_capped_discount "CODE" "percentage" max_amount_in_cents "color"
###############################################################################
create_capped_discount() {
  local code=$1
  local percentage=$2
  local max_amount=$3  # in cents (e.g., 2000 = $20.00 max)
  local color=${4:-"#7851A9"}  # Default purple
  local max_display=$(echo "scale=2; $max_amount/100" | bc)

  echo "📝 Creating Capped Discount: $code ($percentage% off, max \$${max_display})"

  response=$(curl -s ${API_BASE}/v2/catalog/object \
    -X POST \
    -H "Square-Version: ${SQUARE_VERSION}" \
    -H "Authorization: Bearer ${ACCESS_TOKEN}" \
    -H 'Content-Type: application/json' \
    -d "{
      \"idempotency_key\": \"discount-${code,,}-$(date +%s)\",
      \"object\": {
        \"type\": \"DISCOUNT\",
        \"id\": \"#${code,,}\",
        \"discount_data\": {
          \"name\": \"${code}\",
          \"discount_type\": \"FIXED_PERCENTAGE\",
          \"percentage\": \"${percentage}\",
          \"maximum_amount_money\": {
            \"amount\": ${max_amount},
            \"currency\": \"USD\"
          },
          \"pin_required\": false,
          \"label_color\": \"${color}\"
        }
      }
    }")

  # Parse response
  discount_id=$(echo "$response" | jq -r '.catalog_object.id // "FAILED"')
  error_msg=$(echo "$response" | jq -r '.errors[0].detail // ""')

  if [ "$discount_id" != "FAILED" ] && [ -n "$discount_id" ]; then
    echo "  ✅ SUCCESS: Created discount"
    echo "  📋 Discount ID: $discount_id"
    echo "  💾 Add to verify-coupon/route.ts:"
    echo "     '${code}': '${discount_id}'"
    echo ""
  else
    echo "  ❌ FAILED: Could not create discount"
    [ -n "$error_msg" ] && echo "  Error: $error_msg"
    echo ""
  fi
}

###############################################################################
# COUPON EXAMPLES - UNCOMMENT TO CREATE
###############################################################################

# 🎉 NEW CLIENT OFFERS
# create_percentage_discount "NEWCLIENT20" "20" "#7851A9"  # 20% off for new clients
# create_fixed_discount "WELCOME15" "1500" "#7851A9"       # $15 off welcome discount

# 🎁 REFERRAL DISCOUNTS
# create_percentage_discount "REFER15" "15" "#FF6B6B"      # 15% referral discount
# create_fixed_discount "FRIEND10" "1000" "#FF6B6B"        # $10 friend referral

# 🎂 SPECIAL OCCASIONS
# create_capped_discount "BIRTHDAY25" "25" "2000" "#FFB86C"  # 25% off, max $20
# create_percentage_discount "ANNIVERSARY30" "30" "#FFB86C"  # 30% anniversary

# ⭐ SEASONAL PROMOTIONS
# create_percentage_discount "SUMMER30" "30" "#4ECDC4"     # Summer sale 30%
# create_percentage_discount "FALL20" "20" "#F39C12"       # Fall special 20%
# create_percentage_discount "HOLIDAY25" "25" "#E74C3C"    # Holiday promo 25%

# 🌙 ASTROLOGICAL EVENTS
# create_percentage_discount "FULLMOON20" "20" "#9B59B6"   # Full moon special
# create_percentage_discount "NEWMOON15" "15" "#34495E"    # New moon offer
# create_fixed_discount "ECLIPSE25" "2500" "#8E44AD"       # Eclipse event $25 off

# ⚡ FLASH SALES & LIMITED TIME
# create_percentage_discount "FLASH40" "40" "#E74C3C"      # Flash sale 40%
# create_capped_discount "WEEKEND30" "30" "3000" "#3498DB"  # Weekend sale, max $30
# create_percentage_discount "EARLYBIRD10" "10" "#2ECC71"  # Early booking 10%

# 📦 PACKAGE DEALS
# create_percentage_discount "BUNDLE25" "25" "#9B59B6"     # Bundle discount 25%
# create_fixed_discount "PACKAGE50" "5000" "#16A085"       # Package deal $50 off

# 💎 VIP & LOYALTY
# create_percentage_discount "VIP20" "20" "#FFD700"        # VIP client 20%
# create_percentage_discount "LOYAL15" "15" "#C0C0C0"      # Loyalty reward 15%
# create_fixed_discount "REWARDS20" "2000" "#CD7F32"       # Rewards points $20

###############################################################################
# ACTIVE COUPONS - SHOW CURRENT PRODUCTION COUPONS
###############################################################################

echo ""
echo "═══════════════════════════════════════════════════════"
echo "  Current Active Coupons in Production"
echo "═══════════════════════════════════════════════════════"
echo ""

# Fetch all discounts from Square
discounts=$(curl -s ${API_BASE}/v2/catalog/list?types=DISCOUNT \
  -H "Square-Version: ${SQUARE_VERSION}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")

# Display discounts in a nice format
echo "$discounts" | jq -r '.objects[]? |
  "  • \(.discount_data.name): " +
  (if .discount_data.discount_type == "FIXED_PERCENTAGE"
   then (.discount_data.percentage + "% off")
   else ("$" + ((.discount_data.amount_money.amount / 100) | tostring) + " off")
   end) +
  " (ID: \(.id))"'

echo ""
echo "═══════════════════════════════════════════════════════"
echo ""
echo "💡 TIP: To create coupons, uncomment examples above"
echo "📝 DON'T FORGET: Add discount IDs to verify-coupon/route.ts"
echo ""
