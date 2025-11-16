require('dotenv').config({ path: '.env.local' })

const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN
const SQUARE_VERSION = '2025-10-16'

// Product variation IDs and new prices
const priceUpdates = [
  {
    name: 'ParaCleanse Elite',
    variationId: '5JV44RI47GC5IMYSENVXMV3D',
    newPrice: 5999 // $59.99
  },
  {
    name: 'Maya Formula',
    variationId: 'TWJMT4CUFNFNQKG3S5EQRPLO',
    newPrice: 4499 // $44.99
  },
  {
    name: 'Sea Moss Capsules',
    variationId: 'YGDG42LYJKWH75NNW6HPWP5M',
    newPrice: 3199 // $31.99
  },
  {
    name: 'Mucus Cleanser',
    variationId: '6JARPI34BXU27SS36ZFSEJQP',
    newPrice: 3199 // $31.99
  }
]

async function updateProductPrice(variationId, newPrice, productName) {
  try {
    console.log(`\n📝 Updating ${productName}...`)
    
    // First, get the current variation to get the version
    const getResponse = await fetch(
      `https://connect.squareup.com/v2/catalog/object/${variationId}`,
      {
        method: 'GET',
        headers: {
          'Square-Version': SQUARE_VERSION,
          'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    )

    const currentData = await getResponse.json()
    
    if (currentData.errors) {
      console.error(`❌ Error fetching ${productName}:`, currentData.errors)
      return false
    }

    const currentVariation = currentData.object
    const currentVersion = currentVariation.version

    console.log(`   Current price: $${(currentVariation.item_variation_data.price_money.amount / 100).toFixed(2)}`)
    console.log(`   New price: $${(newPrice / 100).toFixed(2)}`)

    // Update the variation with new price
    const updateResponse = await fetch(
      'https://connect.squareup.com/v2/catalog/object',
      {
        method: 'POST',
        headers: {
          'Square-Version': SQUARE_VERSION,
          'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          idempotency_key: `${Date.now()}-${variationId}`,
          object: {
            type: 'ITEM_VARIATION',
            id: variationId,
            version: currentVersion,
            item_variation_data: {
              ...currentVariation.item_variation_data,
              price_money: {
                amount: newPrice,
                currency: 'USD'
              }
            }
          }
        })
      }
    )

    const updateData = await updateResponse.json()

    if (updateData.errors) {
      console.error(`❌ Error updating ${productName}:`, updateData.errors)
      return false
    }

    console.log(`✅ ${productName} updated successfully!`)
    return true

  } catch (error) {
    console.error(`❌ Error updating ${productName}:`, error.message)
    return false
  }
}

async function updateAllPrices() {
  console.log('🚀 Starting Square price updates...\n')
  console.log('=' .repeat(50))

  let successCount = 0
  let failCount = 0

  for (const product of priceUpdates) {
    const success = await updateProductPrice(
      product.variationId,
      product.newPrice,
      product.name
    )
    
    if (success) {
      successCount++
    } else {
      failCount++
    }

    // Wait a bit between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  console.log('\n' + '='.repeat(50))
  console.log('\n📊 Summary:')
  console.log(`   ✅ Successful updates: ${successCount}`)
  console.log(`   ❌ Failed updates: ${failCount}`)
  console.log('\n✨ Price update complete!')
}

// Run the updates
updateAllPrices().catch(console.error)
