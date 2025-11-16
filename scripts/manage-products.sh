#!/bin/bash

###############################################################################
# Square Product Management Script - Parasite Cleanse Landing (Dr. Sebi Products)
#
# Comprehensive product management for Square catalog:
# - Create new products
# - Update existing products
# - Delete products
# - List all products
# - Search products
# - Manage categories
#
# Usage:
#   ./scripts/manage-products.sh [command]
#
# Commands:
#   list        - List all products
#   search      - Search products by keyword
#   create      - Create new product (edit script first)
#   update      - Update existing product
#   delete      - Delete product by ID
#   categories  - List all categories
###############################################################################

# TODO: Replace with Carl's Square Production Access Token
# Get from: https://developer.squareup.com/apps → Your App → Credentials
ACCESS_TOKEN="YOUR_SQUARE_ACCESS_TOKEN_HERE"
API_BASE="https://connect.squareup.com"
SQUARE_VERSION="2025-10-16"

###############################################################################
# UTILITY FUNCTIONS
###############################################################################

print_header() {
  echo ""
  echo "═══════════════════════════════════════════════════════"
  echo "  $1"
  echo "═══════════════════════════════════════════════════════"
  echo ""
}

print_success() {
  echo "  ✅ $1"
}

print_error() {
  echo "  ❌ $1"
}

print_info() {
  echo "  ℹ️  $1"
}

###############################################################################
# LIST ALL PRODUCTS
###############################################################################

list_products() {
  print_header "Square Product Catalog"

  response=$(curl -s ${API_BASE}/v2/catalog/list?types=ITEM \
    -H "Square-Version: ${SQUARE_VERSION}" \
    -H "Authorization: Bearer ${ACCESS_TOKEN}")

  # Check for errors
  error=$(echo "$response" | jq -r '.errors[0].detail // ""')
  if [ -n "$error" ]; then
    print_error "Failed to fetch products: $error"
    return 1
  fi

  # Count products
  count=$(echo "$response" | jq '.objects | length')
  echo "Total Products: $count"
  echo ""

  # Display products
  echo "$response" | jq -r '.objects[] |
    "• \(.item_data.name)",
    "  ID: \(.id)",
    "  Price: $" + ((.item_data.variations[0].item_variation_data.price_money.amount // 0 / 100) | tostring),
    "  Type: \(.item_data.product_type // "N/A")",
    ""'
}

###############################################################################
# SEARCH PRODUCTS
###############################################################################

search_products() {
  local keyword=$1

  if [ -z "$keyword" ]; then
    echo "Usage: $0 search KEYWORD"
    return 1
  fi

  print_header "Searching for: $keyword"

  response=$(curl -s ${API_BASE}/v2/catalog/search \
    -X POST \
    -H "Square-Version: ${SQUARE_VERSION}" \
    -H "Authorization: Bearer ${ACCESS_TOKEN}" \
    -H 'Content-Type: application/json' \
    -d "{
      \"object_types\": [\"ITEM\"],
      \"query\": {
        \"text_query\": {
          \"keywords\": [\"${keyword}\"]
        }
      }
    }")

  # Display results
  count=$(echo "$response" | jq '.objects | length')
  echo "Found: $count product(s)"
  echo ""

  echo "$response" | jq -r '.objects[]? |
    "• \(.item_data.name)",
    "  ID: \(.id)",
    "  Price: $" + ((.item_data.variations[0].item_variation_data.price_money.amount // 0 / 100) | tostring),
    ""'
}

###############################################################################
# GET PRODUCT DETAILS
###############################################################################

get_product() {
  local product_id=$1

  if [ -z "$product_id" ]; then
    echo "Usage: $0 get PRODUCT_ID"
    return 1
  fi

  print_header "Product Details: $product_id"

  curl -s ${API_BASE}/v2/catalog/object/${product_id} \
    -H "Square-Version: ${SQUARE_VERSION}" \
    -H "Authorization: Bearer ${ACCESS_TOKEN}" | jq '.'
}

###############################################################################
# CREATE PRODUCT
###############################################################################

create_product() {
  local name=$1
  local description=$2
  local price=$3  # in cents
  local product_type=${4:-"DIGITAL"}

  if [ -z "$name" ] || [ -z "$price" ]; then
    echo ""
    echo "Usage: $0 create \"Product Name\" \"Description\" PRICE_IN_CENTS [TYPE]"
    echo ""
    echo "Examples:"
    echo "  $0 create \"New Reading\" \"30 min session\" 4500 DIGITAL"
    echo "  $0 create \"Gift Card\" \"50 dollar gift card\" 5000 REGULAR"
    echo ""
    return 1
  fi

  local slug=$(echo "$name" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
  local timestamp=$(date +%s)

  print_header "Creating Product: $name"

  response=$(curl -s ${API_BASE}/v2/catalog/object \
    -X POST \
    -H "Square-Version: ${SQUARE_VERSION}" \
    -H "Authorization: Bearer ${ACCESS_TOKEN}" \
    -H 'Content-Type: application/json' \
    -d "{
      \"idempotency_key\": \"product-${slug}-${timestamp}\",
      \"object\": {
        \"type\": \"ITEM\",
        \"id\": \"#${slug}\",
        \"item_data\": {
          \"name\": \"${name}\",
          \"description\": \"${description}\",
          \"product_type\": \"${product_type}\",
          \"variations\": [
            {
              \"type\": \"ITEM_VARIATION\",
              \"id\": \"#${slug}-variation\",
              \"item_variation_data\": {
                \"name\": \"Regular\",
                \"pricing_type\": \"FIXED_PRICING\",
                \"price_money\": {
                  \"amount\": ${price},
                  \"currency\": \"USD\"
                }
              }
            }
          ]
        }
      }
    }")

  # Parse response
  product_id=$(echo "$response" | jq -r '.catalog_object.id // "FAILED"')
  error=$(echo "$response" | jq -r '.errors[0].detail // ""')

  if [ "$product_id" != "FAILED" ] && [ -n "$product_id" ]; then
    print_success "Product created successfully"
    echo ""
    echo "  📦 Name: $name"
    echo "  💰 Price: \$$(echo "scale=2; $price/100" | bc)"
    echo "  🆔 Product ID: $product_id"
    echo ""
  else
    print_error "Failed to create product"
    [ -n "$error" ] && echo "  Error: $error"
    echo ""
  fi
}

###############################################################################
# UPDATE PRODUCT PRICE
###############################################################################

update_price() {
  local product_id=$1
  local new_price=$2  # in cents

  if [ -z "$product_id" ] || [ -z "$new_price" ]; then
    echo "Usage: $0 update-price PRODUCT_ID NEW_PRICE_IN_CENTS"
    echo "Example: $0 update-price ABC123XYZ 6500"
    return 1
  fi

  print_header "Updating Price for: $product_id"

  # First get current product details
  product=$(curl -s ${API_BASE}/v2/catalog/object/${product_id} \
    -H "Square-Version: ${SQUARE_VERSION}" \
    -H "Authorization: Bearer ${ACCESS_TOKEN}")

  version=$(echo "$product" | jq -r '.object.version')
  name=$(echo "$product" | jq -r '.object.item_data.name')
  variation_id=$(echo "$product" | jq -r '.object.item_data.variations[0].id')
  variation_version=$(echo "$product" | jq -r '.object.item_data.variations[0].version')

  if [ "$version" == "null" ]; then
    print_error "Product not found: $product_id"
    return 1
  fi

  print_info "Current product: $name"
  print_info "Updating to: \$$(echo "scale=2; $new_price/100" | bc)"

  # Update the price
  response=$(curl -s ${API_BASE}/v2/catalog/object \
    -X POST \
    -H "Square-Version: ${SQUARE_VERSION}" \
    -H "Authorization: Bearer ${ACCESS_TOKEN}" \
    -H 'Content-Type: application/json' \
    -d "{
      \"idempotency_key\": \"update-${product_id}-$(date +%s)\",
      \"object\": {
        \"type\": \"ITEM\",
        \"id\": \"${product_id}\",
        \"version\": ${version},
        \"item_data\": {
          \"variations\": [
            {
              \"type\": \"ITEM_VARIATION\",
              \"id\": \"${variation_id}\",
              \"version\": ${variation_version},
              \"item_variation_data\": {
                \"pricing_type\": \"FIXED_PRICING\",
                \"price_money\": {
                  \"amount\": ${new_price},
                  \"currency\": \"USD\"
                }
              }
            }
          ]
        }
      }
    }")

  # Check result
  updated_id=$(echo "$response" | jq -r '.catalog_object.id // "FAILED"')
  error=$(echo "$response" | jq -r '.errors[0].detail // ""')

  if [ "$updated_id" != "FAILED" ] && [ -n "$updated_id" ]; then
    print_success "Price updated successfully"
    echo ""
  else
    print_error "Failed to update price"
    [ -n "$error" ] && echo "  Error: $error"
    echo ""
  fi
}

###############################################################################
# DELETE PRODUCT
###############################################################################

delete_product() {
  local product_id=$1

  if [ -z "$product_id" ]; then
    echo "Usage: $0 delete PRODUCT_ID"
    return 1
  fi

  print_header "Deleting Product: $product_id"

  # Get product name first
  product=$(curl -s ${API_BASE}/v2/catalog/object/${product_id} \
    -H "Square-Version: ${SQUARE_VERSION}" \
    -H "Authorization: Bearer ${ACCESS_TOKEN}")

  name=$(echo "$product" | jq -r '.object.item_data.name // "Unknown"')

  echo "⚠️  WARNING: About to delete: $name"
  echo ""
  read -p "Are you sure? (yes/no): " confirm

  if [ "$confirm" != "yes" ]; then
    print_info "Deletion cancelled"
    return 0
  fi

  # Delete the product
  response=$(curl -s ${API_BASE}/v2/catalog/object/${product_id} \
    -X DELETE \
    -H "Square-Version: ${SQUARE_VERSION}" \
    -H "Authorization: Bearer ${ACCESS_TOKEN}")

  # Check result
  error=$(echo "$response" | jq -r '.errors[0].detail // ""')

  if [ -z "$error" ]; then
    print_success "Product deleted: $name"
    echo ""
  else
    print_error "Failed to delete product"
    echo "  Error: $error"
    echo ""
  fi
}

###############################################################################
# LIST CATEGORIES
###############################################################################

list_categories() {
  print_header "Square Categories"

  response=$(curl -s ${API_BASE}/v2/catalog/list?types=CATEGORY \
    -H "Square-Version: ${SQUARE_VERSION}" \
    -H "Authorization: Bearer ${ACCESS_TOKEN}")

  count=$(echo "$response" | jq '.objects | length')
  echo "Total Categories: $count"
  echo ""

  echo "$response" | jq -r '.objects[]? |
    "• \(.category_data.name)",
    "  ID: \(.id)",
    ""'
}

###############################################################################
# CREATE CATEGORY
###############################################################################

create_category() {
  local name=$1

  if [ -z "$name" ]; then
    echo "Usage: $0 create-category \"Category Name\""
    return 1
  fi

  local slug=$(echo "$name" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')

  print_header "Creating Category: $name"

  response=$(curl -s ${API_BASE}/v2/catalog/object \
    -X POST \
    -H "Square-Version: ${SQUARE_VERSION}" \
    -H "Authorization: Bearer ${ACCESS_TOKEN}" \
    -H 'Content-Type: application/json' \
    -d "{
      \"idempotency_key\": \"category-${slug}-$(date +%s)\",
      \"object\": {
        \"type\": \"CATEGORY\",
        \"id\": \"#${slug}\",
        \"category_data\": {
          \"name\": \"${name}\"
        }
      }
    }")

  category_id=$(echo "$response" | jq -r '.catalog_object.id // "FAILED"')
  error=$(echo "$response" | jq -r '.errors[0].detail // ""')

  if [ "$category_id" != "FAILED" ] && [ -n "$category_id" ]; then
    print_success "Category created: $name"
    echo "  ID: $category_id"
    echo ""
  else
    print_error "Failed to create category"
    [ -n "$error" ] && echo "  Error: $error"
    echo ""
  fi
}

###############################################################################
# MAIN COMMAND ROUTER
###############################################################################

case "${1:-help}" in
  list)
    list_products
    ;;
  search)
    search_products "$2"
    ;;
  get)
    get_product "$2"
    ;;
  create)
    create_product "$2" "$3" "$4" "$5"
    ;;
  update-price)
    update_price "$2" "$3"
    ;;
  delete)
    delete_product "$2"
    ;;
  categories)
    list_categories
    ;;
  create-category)
    create_category "$2"
    ;;
  help|*)
    print_header "Square Product Management - Amber Unbound"
    echo "Usage: $0 [command] [options]"
    echo ""
    echo "Commands:"
    echo "  list                              - List all products"
    echo "  search KEYWORD                    - Search products by keyword"
    echo "  get PRODUCT_ID                    - Get product details"
    echo "  create \"Name\" \"Desc\" PRICE [TYPE] - Create new product"
    echo "  update-price PRODUCT_ID PRICE     - Update product price"
    echo "  delete PRODUCT_ID                 - Delete product"
    echo "  categories                        - List all categories"
    echo "  create-category \"Name\"            - Create new category"
    echo ""
    echo "Examples:"
    echo "  $0 list"
    echo "  $0 search \"Tarot\""
    echo "  $0 create \"New Reading\" \"45 min session\" 6500 DIGITAL"
    echo "  $0 update-price ABC123XYZ 7500"
    echo "  $0 delete ABC123XYZ"
    echo ""
    echo "Price format: Always in cents (3500 = \$35.00)"
    echo "Product types: DIGITAL, REGULAR, APPOINTMENTS_SERVICE"
    echo ""
    ;;
esac
