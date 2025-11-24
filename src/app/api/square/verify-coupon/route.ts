import { NextRequest, NextResponse } from 'next/server'

// Square discount IDs
const SQUARE_DISCOUNTS: Record<string, string> = {
  'TEST99': 'PAAUNOPINBLM2RDQFOEQAJNJ',  // 99% off for testing
  'STOPMUCUS': 'KYF4T674JG7Y7HMEMLZY56BF',  // 37.5% off for win-back campaign
  'BLACKFRIDAY30': 'OKH4J6DXBYA7GRKK237LHRX5'  // 30% off Black Friday sale
}

export async function POST(request: NextRequest) {
  try {
    const { code, price } = await request.json()
    const discountId = SQUARE_DISCOUNTS[code.toUpperCase()]

    if (!discountId) {
      return NextResponse.json({ valid: false })
    }

    // Get discount details from Square
    const response = await fetch(`https://connect.squareup.com/v2/catalog/object/${discountId}`, {
      headers: {
        'Square-Version': '2025-10-16',
        'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (!data.object) {
      return NextResponse.json({ valid: false })
    }

    const discountData = data.object.discount_data
    let discountAmount = 0

    if (discountData.discount_type === 'FIXED_PERCENTAGE') {
      // Calculate percentage discount
      const percentage = parseFloat(discountData.percentage)
      discountAmount = Math.round((price * percentage) / 100)
    } else if (discountData.discount_type === 'FIXED_AMOUNT') {
      // Fixed amount discount
      discountAmount = discountData.amount_money.amount
    }

    return NextResponse.json({
      valid: true,
      discount: discountAmount,
      discountId: discountId,
      name: discountData.name
    })
  } catch (error) {
    return NextResponse.json({ valid: false }, { status: 400 })
  }
}
